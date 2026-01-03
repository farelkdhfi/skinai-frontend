import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import {
    Upload, Camera as CameraIcon, Check,
    AlertCircle, Sun, Move, Maximize, Loader2,
    ImageIcon, ArrowLeft
} from 'lucide-react';

import { useAnalysis } from '../context/AnalysisContext';
import {
    ROI_POINTS, CAMERA_CONFIG,
    VALIDATION_THRESHOLDS, CROP_SIZE, ROUTES
} from '../config';

// --- Animated Scan Overlay Component ---
const ScanOverlay = ({ isActive }) => {
    if (!isActive) return null;

    return (
        <div className="absolute inset-0 z-20 pointer-events-none p-8 md:p-12">
            {/* Corners */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/80 rounded-tl-3xl" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/80 rounded-tr-3xl" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/80 rounded-bl-3xl" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/80 rounded-br-3xl" />

            {/* Scanning Line */}
            <motion.div
                initial={{ top: "10%" }}
                animate={{ top: "90%" }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="absolute left-12 right-12 h-0.5 bg-linear-to-r from-transparent via-indigo-400 to-transparent opacity-70 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            />

            {/* Center Focus */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-48 h-64 border border-dashed border-white/50 rounded-[40%]" />
            </div>

            <div className="absolute bottom-12 left-0 right-0 text-center">
                <p className="text-xs font-medium tracking-[0.2em] text-white uppercase">
                    Align Face Within Frame
                </p>
            </div>
        </div>
    );
};

export default function SmartCameraPage({ initialMode = 'camera' }) {
    const navigate = useNavigate();
    const { analyze, isAnalyzing, reset } = useAnalysis();

    const webcamRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    
    // Refs untuk MediaPipe
    const faceLandmarkerRef = useRef(null);
    const requestRef = useRef(null); 
    const processingCanvasRef = useRef(document.createElement('canvas'));

    const [mode, setMode] = useState(initialMode);
    const [selectedImage, setSelectedImage] = useState(null);
    const [capturedFrame, setCapturedFrame] = useState(null);
    const [validations, setValidations] = useState({
        faceDetected: false,
        brightness: { valid: false, value: 0 },
        roi: { valid: false, value: 0 },
        orientation: { valid: false, yaw: 0, pitch: 0, roll: 0 }
    });
    const [isReady, setIsReady] = useState(false);
    const [showError, setShowError] = useState(false);
    const [uploadFaceDetected, setUploadFaceDetected] = useState(false);
    const [currentLandmarks, setCurrentLandmarks] = useState(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    // --- Handle Back Navigation ---
    const handleBack = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
        
        if (canvasRef.current) {
             const ctx = canvasRef.current.getContext('2d');
             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        navigate(ROUTES.ANALYZE);
    }, [navigate]);

    // --- Logic Functions ---
    const calculateBrightness = useCallback((source) => {
        const canvas = processingCanvasRef.current;
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(source, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
            sum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }
        return sum / (data.length / 4);
    }, []);

    const calculateROI = useCallback((landmarks, width, height) => {
        if (!landmarks || landmarks.length === 0) return 0;
        const xs = landmarks.map(l => l.x * width);
        const ys = landmarks.map(l => l.y * height);
        const faceArea = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
        return faceArea / (width * height);
    }, []);

    const calculateOrientation = useCallback((landmarks) => {
        if (!landmarks || landmarks.length < 468) return { yaw: 0, pitch: 0, roll: 0 };
        const noseTip = landmarks[4];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const eyeMidX = (leftEye.x + rightEye.x) / 2;
        const eyeMidY = (leftEye.y + rightEye.y) / 2;
        const yaw = (noseTip.x - eyeMidX) * 100;
        const pitch = (noseTip.y - eyeMidY) * 100;
        const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);
        return { yaw: Math.abs(yaw), pitch: Math.abs(pitch), roll: Math.abs(roll) };
    }, []);

    // --- Handle Results ---
    const handleResults = useCallback((results, inputWidth, inputHeight) => {
        const hasFace = results.faceLandmarks && results.faceLandmarks.length > 0;

        if (!hasFace) {
            setValidations({
                faceDetected: false,
                brightness: { valid: false, value: 0 },
                roi: { valid: false, value: 0 },
                orientation: { valid: false, yaw: 0, pitch: 0, roll: 0 }
            });
            setIsReady(false);
            if (mode === 'upload') setUploadFaceDetected(false);
            if (canvasRef.current) {
                canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            return;
        }

        const landmarks = results.faceLandmarks[0];
        
        let brightness = 0;
        if (mode === 'camera' && webcamRef.current?.video) {
             brightness = calculateBrightness(webcamRef.current.video);
        } else if (mode === 'upload' && imgRef.current) {
             brightness = calculateBrightness(imgRef.current);
        }

        const brightnessValid = brightness >= VALIDATION_THRESHOLDS.brightness.min && brightness <= VALIDATION_THRESHOLDS.brightness.max;
        const roiValue = calculateROI(landmarks, inputWidth, inputHeight);
        const roiValid = roiValue >= VALIDATION_THRESHOLDS.roiMinArea;
        const orientation = calculateOrientation(landmarks);
        const orientationValid = orientation.yaw <= VALIDATION_THRESHOLDS.maxYaw &&
            orientation.pitch <= VALIDATION_THRESHOLDS.maxPitch &&
            orientation.roll <= VALIDATION_THRESHOLDS.maxRoll;

        setValidations({
            faceDetected: true,
            brightness: { valid: brightnessValid, value: Math.round(brightness) },
            roi: { valid: roiValid, value: Math.round(roiValue * 100) },
            orientation: { valid: orientationValid, ...orientation }
        });

        setCurrentLandmarks(landmarks);
        
        if (mode === 'upload') {
            setUploadFaceDetected(true);
            setIsReady(true);
        } else {
            setIsReady(brightnessValid && roiValid && orientationValid);
        }

        // --- Drawing Logic (HANYA UNTUK MODE CAMERA) ---
        if (canvasRef.current) {
            const overlayCtx = canvasRef.current.getContext('2d');
            canvasRef.current.width = inputWidth;
            canvasRef.current.height = inputHeight;
            
            // Selalu bersihkan canvas dulu
            overlayCtx.clearRect(0, 0, inputWidth, inputHeight);

            // JIKA MODE UPLOAD, BERHENTI DI SINI (JANGAN GAMBAR OVERLAY)
            if (mode === 'upload') return;

            // JIKA MODE CAMERA, GAMBAR MESH
            const currentlyValid = brightnessValid && roiValid && orientationValid;
            overlayCtx.lineWidth = 0.5;
            overlayCtx.strokeStyle = currentlyValid ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)';
            
            if (FaceLandmarker.FACE_LANDMARKS_TESSELATION) {
                for (const connection of FaceLandmarker.FACE_LANDMARKS_TESSELATION) {
                    const point1 = landmarks[connection.start];
                    const point2 = landmarks[connection.end];
                    if (point1 && point2) {
                        overlayCtx.beginPath();
                        overlayCtx.moveTo(point1.x * inputWidth, point1.y * inputHeight);
                        overlayCtx.lineTo(point2.x * inputWidth, point2.y * inputHeight);
                        overlayCtx.stroke();
                    }
                }
            }
        }
    }, [calculateBrightness, calculateROI, calculateOrientation, mode]);

    // --- Init MediaPipe Tasks Vision ---
    useEffect(() => {
        const initLandmarker = async () => {
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );
            
            faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: mode === 'camera' ? "VIDEO" : "IMAGE",
                numFaces: 1
            });
            setModelLoaded(true);
        };
        
        initLandmarker();

        return () => {
            if (faceLandmarkerRef.current) {
                faceLandmarkerRef.current.close();
            }
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Switch Running Mode when 'mode' changes ---
    useEffect(() => {
        if (faceLandmarkerRef.current) {
            try {
                 faceLandmarkerRef.current.setOptions({ 
                    runningMode: mode === 'camera' ? "VIDEO" : "IMAGE" 
                });
            } catch(e) {
                console.log("Could not set options", e);
            }
        }
        
        reset();
        setSelectedImage(null);
        setIsReady(false);
        setUploadFaceDetected(false);
        if (canvasRef.current) {
            canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [mode, reset]);

    // --- Camera Loop ---
    const predictWebcam = useCallback(() => {
        if (mode !== 'camera' || !webcamRef.current?.video) return;

        const video = webcamRef.current.video;
        
        if (video.readyState !== 4) {
             requestRef.current = requestAnimationFrame(predictWebcam);
             return;
        }

        const startTimeMs = performance.now();
        
        if (faceLandmarkerRef.current) {
             const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
             handleResults(results, video.videoWidth, video.videoHeight);
        }
        
        if (mode === 'camera') {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    }, [mode, handleResults]);

    useEffect(() => {
        if (mode === 'camera' && modelLoaded) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, [mode, modelLoaded, predictWebcam]);


    // --- Upload Detection ---
    useEffect(() => {
        if (mode !== 'upload' || !selectedImage || !imgRef.current || !modelLoaded) return;
        
        const detectFace = async () => {
             if (faceLandmarkerRef.current && imgRef.current.complete) {
                await faceLandmarkerRef.current.setOptions({ runningMode: "IMAGE" });
                
                // Meskipun kita tidak menggambar overlay, kita tetap butuh dimensi
                // untuk kalkulasi ROI yang akurat
                const rect = imgRef.current.getBoundingClientRect();
                const displayWidth = rect.width;
                const displayHeight = rect.height;

                const results = faceLandmarkerRef.current.detect(imgRef.current);
                handleResults(results, displayWidth, displayHeight);
            }
        };

        if (imgRef.current.complete) detectFace();
        else imgRef.current.onload = detectFace;
    }, [mode, selectedImage, modelLoaded, handleResults]);


    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setSelectedImage(url);
            setUploadFaceDetected(false);
        }
    };

    const handleCapture = async () => {
        const source = mode === 'camera' ? webcamRef.current?.video : imgRef.current;
        if (!source) return;

        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        const width = mode === 'camera' ? source.videoWidth : source.naturalWidth;
        const height = mode === 'camera' ? source.videoHeight : source.naturalHeight;
        const canvas = processingCanvasRef.current;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(source, 0, 0);

        if (mode === 'camera') setCapturedFrame(canvas.toDataURL('image/jpeg'));

        if (!faceLandmarkerRef.current && mode === 'camera') {
            setShowError(true);
            setCapturedFrame(null);
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }

        try {
            let patches = {};
            if (mode === 'upload' && !uploadFaceDetected) {
                const resizedCanvas = document.createElement('canvas');
                resizedCanvas.width = CROP_SIZE;
                resizedCanvas.height = CROP_SIZE;
                resizedCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height, 0, 0, CROP_SIZE, CROP_SIZE);
                patches['full_image'] = resizedCanvas.toDataURL('image/jpeg');
            } else {
                const landmarks = currentLandmarks;
                if (!landmarks || landmarks.length < 468) {
                    setShowError(true);
                    setCapturedFrame(null);
                    if (mode === 'camera') requestRef.current = requestAnimationFrame(predictWebcam);
                    return;
                }
                const leftEye = landmarks[33];
                const rightEye = landmarks[263];
                const eyeDistance = Math.sqrt(Math.pow((rightEye.x - leftEye.x) * width, 2) + Math.pow((rightEye.y - leftEye.y) * height, 2));
                const dynamicCropSize = Math.min(224, Math.max(80, Math.round(eyeDistance * 0.9)));

                Object.keys(ROI_POINTS).forEach((region) => {
                    const point = landmarks[ROI_POINTS[region].id];
                    const centerX = point.x * width;
                    const centerY = point.y * height;
                    const startX = Math.max(0, Math.min(width - dynamicCropSize, centerX - dynamicCropSize / 2));
                    const startY = Math.max(0, Math.min(height - dynamicCropSize, centerY - dynamicCropSize / 2));
                    const patchCanvas = document.createElement('canvas');
                    patchCanvas.width = CROP_SIZE;
                    patchCanvas.height = CROP_SIZE;
                    patchCanvas.getContext('2d').drawImage(canvas, startX, startY, dynamicCropSize, dynamicCropSize, 0, 0, CROP_SIZE, CROP_SIZE);
                    patches[region] = patchCanvas.toDataURL('image/jpeg');
                });
            }
            const fullImage = canvas.toDataURL('image/jpeg');
            await analyze(patches, fullImage);
            setCapturedFrame(null);
            navigate(ROUTES.RESULTS);
        } catch (err) {
            console.error('Analysis error:', err);
            setCapturedFrame(null);
            setShowError(true);
            if (mode === 'camera') requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    const allValid = validations.faceDetected && validations.brightness.valid && validations.roi.valid && validations.orientation.valid;

    return (
        <div className="min-h-screen bg-white text-zinc-950 overflow-hidden">

            <main className="relative max-w-5xl mx-auto px-6 pt-12 pb-12 flex flex-col items-center min-h-[calc(100vh-80px)]">

                {/* Top Navigation / Title */}
                <div className="w-full flex items-center justify-between mb-8 z-10">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors border border-zinc-200 text-zinc-500 hover:text-zinc-900"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <h1 className="text-lg font-medium tracking-tight text-zinc-900">
                        {mode === 'camera' ? 'Live Diagnosis' : 'Image Upload'}
                    </h1>

                    <div className="w-10" />
                </div>

                {/* --- CAMERA VIEWPORT --- */}
                <div className="relative w-full max-w-3xl aspect-4/3 md:aspect-video rounded-[2.5rem] overflow-hidden bg-zinc-900 shadow-2xl ring-1 ring-zinc-900/10">

                    {/* Mode Toggle */}
                    {!initialMode && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-black/40 backdrop-blur-md p-1 rounded-full flex gap-1 border border-white/10">
                            <button
                                onClick={() => setMode('camera')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'camera' ? 'bg-white text-zinc-900' : 'text-white/70 hover:text-white'}`}
                            >
                                Live
                            </button>
                            <button
                                onClick={() => setMode('upload')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'upload' ? 'bg-white text-zinc-900' : 'text-white/70 hover:text-white'}`}
                            >
                                Upload
                            </button>
                        </div>
                    )}

                    {/* Camera/Image Content */}
                    <div className="w-full h-full relative">
                        {mode === 'camera' ? (
                            capturedFrame ? (
                                <img src={capturedFrame} alt="Captured" className="w-full h-full object-cover scale-x-[-1]" />
                            ) : (
                                <Webcam
                                    ref={webcamRef}
                                    className="w-full h-full object-cover scale-x-[-1]"
                                    videoConstraints={CAMERA_CONFIG}
                                    onUserMediaError={(e) => console.error("Camera Error", e)}
                                />
                            )
                        ) : selectedImage ? (
                            <img ref={imgRef} src={selectedImage} alt="Selected" className={`w-full h-full object-contain bg-zinc-900 ${mode === 'camera' ? 'scale-x-[-1]' : ''}`} />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-4 bg-zinc-900">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-medium text-zinc-400">Select an image to analyze</p>
                            </div>
                        )}

                        {/* Canvas Overlay */}
                        <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${mode === 'camera' ? 'scale-x-[-1]' : ''}`} />

                        {/* Loading Model Indicator */}
                        {!modelLoaded && (
                             <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900">
                                 <Loader2 className="w-8 h-8 text-white animate-spin" />
                                 <span className="ml-2 text-white text-sm">Loading AI Model...</span>
                             </div>
                        )}

                        {/* Scanning HUD Overlay */}
                        {mode === 'camera' && !isAnalyzing && !capturedFrame && modelLoaded && (
                            <ScanOverlay isActive={true} />
                        )}

                        {/* Analysis Loader */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-40 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white"
                                >
                                    <Loader2 className="w-12 h-12 mb-4 animate-spin text-indigo-500" />
                                    <p className="font-light tracking-widest uppercase text-sm">Processing Diagnostics</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- CONTROLS & STATUS --- */}
                <div className="w-full max-w-2xl mt-8 flex flex-col gap-8">

                    {/* Validation Indicators */}
                    {mode === 'camera' && (
                        <div className="flex justify-between items-center px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl shadow-sm">
                            <ValidationItem
                                label="Lighting"
                                valid={validations.brightness.valid}
                                icon={Sun}
                                value={validations.brightness.value}
                            />
                            <div className="w-px h-8 bg-zinc-200" />
                            <ValidationItem
                                label="Distance"
                                valid={validations.roi.valid}
                                icon={Maximize}
                                value={`${validations.roi.value}%`}
                            />
                            <div className="w-px h-8 bg-zinc-200" />
                            <ValidationItem
                                label="Angle"
                                valid={validations.orientation.valid}
                                icon={Move}
                            />
                        </div>
                    )}

                    {/* Action Area */}
                    <div className="flex items-center justify-center gap-6 relative">

                        {mode === 'upload' && (
                            <label className="absolute left-0 cursor-pointer p-4 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors">
                                <Upload className="w-6 h-6" />
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}

                        {/* Main Shutter Button */}
                        <button
                            onClick={handleCapture}
                            disabled={!modelLoaded || isAnalyzing || (mode === 'camera' && !allValid) || (mode === 'upload' && !selectedImage)}
                            className="group relative"
                        >
                            <div className={`
                                w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
                                ${((mode === 'camera' && allValid) || (mode === 'upload' && selectedImage)) && modelLoaded
                                    ? 'bg-zinc-900 shadow-xl shadow-zinc-300 scale-100 cursor-pointer hover:scale-105'
                                    : 'bg-zinc-200 cursor-not-allowed scale-95 opacity-50'}
                            `}>
                                <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
                                    <div className={`w-12 h-12 rounded-full bg-white transition-all duration-300 ${isAnalyzing ? 'scale-75 animate-pulse' : ''}`} />
                                </div>
                            </div>

                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                                    {isAnalyzing ? 'ANALYZING...' : 'CAPTURE'}
                                </span>
                            </div>
                        </button>

                    </div>
                </div>
            </main>

            {/* Error Modal */}
            <AnimatePresence>
                {showError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4"
                        onClick={() => setShowError(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-medium text-zinc-900 mb-2">Analysis Failed</h3>
                            <p className="text-zinc-500 mb-8 font-light leading-relaxed">
                                We couldn't detect a clear face. Please ensure you are in a well-lit area and facing the camera directly.
                            </p>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ValidationItem({ label, valid, value, icon: Icon }) {
    return (
        <div className={`flex flex-col items-center gap-1 transition-colors duration-300 ${valid ? 'text-emerald-600' : 'text-zinc-400'}`}>
            <div className={`p-2 rounded-full ${valid ? 'bg-emerald-100' : 'bg-zinc-100'}`}>
                {valid ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            {value !== undefined && (
                <span className="text-[10px] font-mono font-medium opacity-80">
                    {value}
                </span>
            )}
        </div>
    );
}