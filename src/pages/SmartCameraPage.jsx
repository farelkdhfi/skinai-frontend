import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import {
    Upload,
    AlertCircle, Sun, Move, Maximize, Loader2,
    ImageIcon, ArrowLeft, ScanLine, Aperture
} from 'lucide-react';

import { useAnalysis } from '../context/AnalysisContext';
import {
    ROI_POINTS,
    VALIDATION_THRESHOLDS, CROP_SIZE, ROUTES
} from '../config';

// --- COMPONENTS: ELEGANT UI ELEMENTS ---

// 1. Futuristic Scan Overlay (Reticle Style)
const ScanOverlay = ({ isActive }) => {
    if (!isActive) return null;

    return (
        <div className="absolute inset-0 z-20 pointer-events-none p-10 flex items-center justify-center">
            {/* Outer Frame with Blur */}
            <div className="absolute inset-0 border-[0.5px] border-white/10 m-6 rounded-[3rem] pointer-events-none" />

            {/* Animated Corners */}
            <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white rounded-br-lg" />

                {/* Scanning Laser */}
                <motion.div
                    initial={{ top: "0%", opacity: 0 }}
                    animate={{ top: "100%", opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute left-0 right-0 h-[1px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                />

                {/* Central Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-4 h-4 border border-white/50 rounded-full flex items-center justify-center">
                        <div className="w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                </div>
            </div>

            {/* Status Text */}
            <div className="absolute bottom-10 left-0 right-0 text-center">
                <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] font-medium tracking-[0.2em] text-white uppercase">
                        System Active
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

// 2. Minimalist Status Grid (Monochrome)
const StatusGrid = ({ validations }) => {
    const items = [
        { label: 'LIGHTING', valid: validations.brightness.valid, value: validations.brightness.value, icon: Sun },
        { label: 'PROXIMITY', valid: validations.roi.valid, value: `${validations.roi.value}%`, icon: Maximize },
        { label: 'ANGLE', valid: validations.orientation.valid, value: '0°', icon: Move }, // Simplified value for UI cleanliness
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className={`
                        relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border transition-all duration-500
                        ${item.valid
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg'
                            : 'bg-white border-zinc-200 text-zinc-400'
                        }
                    `}
                >
                    <div className="flex items-center gap-1.5 mb-2">
                        <item.icon className={`w-3.5 h-3.5 ${item.valid ? 'text-white' : 'text-zinc-300'}`} />
                        <span className="text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
                    </div>
                    <span className={`text-sm font-mono font-medium ${item.valid ? 'text-zinc-200' : 'text-zinc-300'}`}>
                        {item.valid ? 'OK' : item.value || '--'}
                    </span>

                    {/* Tiny Status Dot */}
                    <div className={`absolute top-2 right-2 w-1 h-1 rounded-full ${item.valid ? 'bg-white' : 'bg-zinc-200'}`} />
                </div>
            ))}
        </div>
    );
};

export default function SmartCameraPage({ initialMode = 'camera' }) {
    const navigate = useNavigate();
    const { analyze, isAnalyzing, reset } = useAnalysis();

    // -- Refs --
    const webcamRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    const faceLandmarkerRef = useRef(null);
    const requestRef = useRef(null);
    const processingCanvasRef = useRef(document.createElement('canvas'));

    // -- State --
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

    // -- Navigation & Logic (Sama seperti logika asli Anda, disederhanakan visualnya) --

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

    const calculateBrightness = useCallback((source) => {
        const canvas = processingCanvasRef.current;
        canvas.width = 50; canvas.height = 50;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(source, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
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
        return ((Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys))) / (width * height);
    }, []);

    const calculateOrientation = useCallback((landmarks) => {
        if (!landmarks || landmarks.length < 468) return { yaw: 0, pitch: 0, roll: 0 };
        const noseTip = landmarks[4];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const eyeMidX = (leftEye.x + rightEye.x) / 2;
        const eyeMidY = (leftEye.y + rightEye.y) / 2;
        return {
            yaw: Math.abs((noseTip.x - eyeMidX) * 100),
            pitch: Math.abs((noseTip.y - eyeMidY) * 100),
            roll: Math.abs(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI))
        };
    }, []);

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
        if (mode === 'camera' && webcamRef.current?.video) brightness = calculateBrightness(webcamRef.current.video);
        else if (mode === 'upload' && imgRef.current) brightness = calculateBrightness(imgRef.current);

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

        // Draw Mesh - Mode Monochrome (White Only)
        if (canvasRef.current && mode !== 'upload') {
            const overlayCtx = canvasRef.current.getContext('2d');
            canvasRef.current.width = inputWidth;
            canvasRef.current.height = inputHeight;
            overlayCtx.clearRect(0, 0, inputWidth, inputHeight);

            // Subtle white mesh
            overlayCtx.lineWidth = 0.8;
            overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

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

    // -- Initialization & Loops --
    useEffect(() => {
        const initLandmarker = async () => {
            const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
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
            if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (faceLandmarkerRef.current) {
            try { faceLandmarkerRef.current.setOptions({ runningMode: mode === 'camera' ? "VIDEO" : "IMAGE" }); }
            catch (e) { console.log(e); }
        }
        reset(); setSelectedImage(null); setIsReady(false); setUploadFaceDetected(false);
        if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [mode, reset]);

    const predictWebcam = useCallback(() => {
        if (mode !== 'camera' || !webcamRef.current?.video) return;
        const video = webcamRef.current.video;
        if (video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }
        if (faceLandmarkerRef.current) {
            const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
            handleResults(results, video.videoWidth, video.videoHeight);
        }
        if (mode === 'camera') requestRef.current = requestAnimationFrame(predictWebcam);
    }, [mode, handleResults]);

    useEffect(() => {
        if (mode === 'camera' && modelLoaded) requestRef.current = requestAnimationFrame(predictWebcam);
        else if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); }
    }, [mode, modelLoaded, predictWebcam]);

    useEffect(() => {
        if (mode !== 'upload' || !selectedImage || !imgRef.current || !modelLoaded) return;
        const detectFace = async () => {
            if (faceLandmarkerRef.current && imgRef.current.complete) {
                await faceLandmarkerRef.current.setOptions({ runningMode: "IMAGE" });
                const rect = imgRef.current.getBoundingClientRect();
                const results = faceLandmarkerRef.current.detect(imgRef.current);
                handleResults(results, rect.width, rect.height);
            }
        };
        if (imgRef.current.complete) detectFace(); else imgRef.current.onload = detectFace;
    }, [mode, selectedImage, modelLoaded, handleResults]);

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
            setUploadFaceDetected(false);
        }
    };

    const handleCapture = async () => {
        const source = mode === 'camera' ? webcamRef.current?.video : imgRef.current;
        if (!source) return;

        // --- LOGIKA FREEZE ---
        // Jika di mode kamera, ambil screenshot terakhir untuk ditampilkan sebagai freeze frame
        if (mode === 'camera' && webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            setCapturedFrame(screenshot);
        }

        // Hentikan deteksi wajah real-time agar mesh tidak bergerak di atas gambar beku
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
        // ---------------------

        const width = mode === 'camera' ? source.videoWidth : source.naturalWidth;
        const height = mode === 'camera' ? source.videoHeight : source.naturalHeight;
        const canvas = processingCanvasRef.current;
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (mode === 'camera') {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(source, 0, 0);

        try {
            let patches = {};
            const landmarks = currentLandmarks;
            if (!landmarks || landmarks.length < 468) throw new Error("No face");

            Object.keys(ROI_POINTS).forEach((region) => {
                const { indices } = ROI_POINTS[region];
                const points = indices.map(idx => ({
                    x: landmarks[idx].x * width,
                    y: landmarks[idx].y * height
                }));

                const minX = Math.min(...points.map(p => p.x));
                const maxX = Math.max(...points.map(p => p.x));
                const minY = Math.min(...points.map(p => p.y));
                const maxY = Math.max(...points.map(p => p.y));

                const roiW = maxX - minX;
                const roiH = maxY - minY;
                const padding = 15;
                const sideLength = Math.max(roiW, roiH) + (padding * 2);
                const centerX = minX + roiW / 2;
                const centerY = minY + roiH / 2;
                const startX = centerX - (sideLength / 2);
                const startY = centerY - (sideLength / 2);

                const patchCanvas = document.createElement('canvas');
                patchCanvas.width = CROP_SIZE;
                patchCanvas.height = CROP_SIZE;
                const pCtx = patchCanvas.getContext('2d');

                pCtx.drawImage(
                    canvas,
                    startX, startY, sideLength, sideLength,
                    0, 0, CROP_SIZE, CROP_SIZE
                );

                patches[region] = patchCanvas.toDataURL('image/jpeg', 0.95);
            });

            await analyze(patches, canvas.toDataURL('image/jpeg'));
            // Navigasi akan dipicu oleh AnalysisContext atau secara manual di sini
            navigate(ROUTES.RESULTS);
        } catch (err) {
            console.error('Analysis error:', err);
            setShowError(true);
            setCapturedFrame(null); // Lepas freeze jika gagal
            if (mode === 'camera') requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    const allValid = validations.faceDetected && validations.brightness.valid && validations.roi.valid && validations.orientation.valid;
    const canCapture = modelLoaded && !isAnalyzing && ((mode === 'camera' && allValid) || (mode === 'upload' && selectedImage));

    // --- RENDER UI ---
    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-zinc-50 overflow-hidden font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">

            {/* --- LEFT: IMMERSIVE VIEWFINDER --- */}
            <div className="relative w-full lg:w-6/12 h-[50vh] lg:h-full bg-black flex items-center justify-center p-4 overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-zinc-900/50 blur-3xl pointer-events-none" />

                {/* Camera Housing */}
                <div className="relative aspect-square h-full max-h-[90vh] w-auto rounded-[2rem] overflow-hidden bg-zinc-950 ring-1 ring-white/10 shadow-2xl">
                    <div className="w-full h-full relative group">

                        {/* Feed */}
                        {mode === 'camera' ? (
                            capturedFrame ? (
                                <img
                                    src={capturedFrame}
                                    alt="Captured"
                                    className="w-full h-full object-cover scale-x-[-1] opacity-100"
                                />
                            ) : (
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg" // Tambahkan ini agar getScreenshot bekerja
                                    className="w-full h-full object-cover scale-x-[-1] brightness-110 contrast-105"
                                    videoConstraints={{ width: 720, height: 720, facingMode: "user", aspectRatio: 1 }}
                                />
                            )
                        ) : selectedImage ? (
                            <img ref={imgRef} src={selectedImage} alt="Selected" className={`w-full h-full object-cover bg-zinc-900 ${mode === 'camera' ? 'scale-x-[-1]' : ''}`} />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-6 bg-zinc-900">
                                <div className="p-6 rounded-full bg-zinc-800/50 border border-zinc-700/50 border-dashed">
                                    <ImageIcon className="w-10 h-10 opacity-50" />
                                </div>
                                <p className="text-xs font-medium tracking-widest uppercase opacity-60">No Image Source</p>
                            </div>
                        )}

                        {/* Overlays */}
                        <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none object-cover ${mode === 'camera' ? 'scale-x-[-1]' : ''}`} />

                        {/* Scanner UI */}
                        {mode === 'camera' && !isAnalyzing && !capturedFrame && modelLoaded && (
                            <ScanOverlay isActive={true} />
                        )}

                        {/* Loading States */}
                        {(!modelLoaded || isAnalyzing) && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                <Loader2 className="w-10 h-10 text-white animate-spin mb-4" strokeWidth={1} />
                                <span className="text-xs font-light tracking-[0.3em] text-white uppercase animate-pulse">
                                    {isAnalyzing ? 'Processing Biometrics' : 'Initializing AI'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: CONTROL CENTER --- */}
            <div className="relative w-full lg:w-6/12 h-[50vh] lg:h-full bg-white flex flex-col">

                {/* Top Nav */}
                <div className="p-8 flex justify-between items-start">
                    <button onClick={handleBack} className="group flex items-center gap-3 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-100 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase hidden lg:block">Exit</span>
                    </button>

                    <div className="flex gap-2 p-1 bg-zinc-100 rounded-full">
                        {['camera', 'upload'].map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`
                                    px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300
                                    ${mode === m ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}
                                `}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-24 pb-12">

                    {/* Headers */}
                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tighter text-zinc-900">
                            {mode === 'camera' ? 'Face Analysis' : 'Upload Source'}
                        </h1>
                        <p className="text-zinc-500 font-light text-lg">
                            {mode === 'camera' ? 'Align your face within the frame.' : 'Select a high-resolution portrait.'}
                        </p>
                    </div>

                    {/* Dynamic Controls */}
                    <div className="w-full max-w-sm space-y-10">

                        {/* 1. Validation Grid (Only Camera) */}
                        <AnimatePresence mode="wait">
                            {mode === 'camera' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="w-full"
                                >
                                    <StatusGrid validations={validations} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 2. Upload Area (Only Upload) */}
                        {mode === 'upload' && (
                            <motion.label
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="block w-full h-32 rounded-2xl border border-dashed border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                            >
                                <Upload className="w-6 h-6 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                                <span className="text-xs font-bold tracking-widest text-zinc-400 group-hover:text-zinc-900 uppercase">Choose File</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </motion.label>
                        )}

                        {/* 3. The Shutter Button */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleCapture}
                                disabled={!canCapture}
                                className="relative group outline-none"
                            >
                                {/* Active Ring Animation */}
                                {canCapture && (
                                    <span className="absolute inset-0 rounded-full border border-zinc-900/30 animate-[ping_2s_ease-in-out_infinite]" />
                                )}

                                {/* Button Container */}
                                <div className={`
                                    w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500
                                    ${canCapture
                                        ? 'bg-zinc-900 shadow-2xl shadow-zinc-900/20 scale-100 hover:scale-105 active:scale-95 cursor-pointer'
                                        : 'bg-zinc-100 border border-zinc-200 cursor-not-allowed opacity-50'}
                                `}>
                                    {canCapture ? (
                                        <div className="relative">
                                            <Aperture className="w-10 h-10 text-white" strokeWidth={1.5} />
                                        </div>
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-zinc-300" />
                                    )}
                                </div>
                            </button>

                            <span className={`mt-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-300 ${canCapture ? 'text-zinc-900' : 'text-zinc-300'}`}>
                                {isAnalyzing ? 'ANALYZING...' : canCapture ? 'START SCAN' : 'WAITING FOR SIGNAL'}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Error Modal (Minimalist) */}
            <AnimatePresence>
                {showError && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md p-6"
                        onClick={() => setShowError(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl ring-1 ring-zinc-100"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-6 h-6 text-zinc-900" />
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Detection Failed</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                Unable to identify a clear facial structure. Please ensure proper lighting and face alignment.
                            </p>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full py-3 bg-zinc-900 text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-black transition-colors"
                            >
                                Retry
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}