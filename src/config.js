/**
 * Frontend Configuration
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const ML_SERVICE_URL = import.meta.env.VITE_ML_URL || 'http://localhost:5000';

// Face Mesh Configuration
export const FACE_MESH_CONFIG = {
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
};

// ROI Points for Face Analysis
// Using MediaPipe FaceMesh landmark indices for accurate skin-only patches
export const ROI_POINTS = {
    forehead: { id: 151, label: 'Forehead' },   // Center forehead between eyebrows
    nose: { id: 4, label: 'Nose' },              // Nose tip
    leftCheek: { id: 50, label: 'L-Cheek' },     // Mid-cheek area (inner, away from ears)
    rightCheek: { id: 280, label: 'R-Cheek' },   // Mid-cheek area (inner, away from ears)
};

// Camera Configuration
export const CAMERA_CONFIG = {
    width: 1280,
    height: 720,
    facingMode: 'user',
};

// Validation Thresholds
export const VALIDATION_THRESHOLDS = {
    brightness: { min: 120, max: 200 }, 
    roiMinArea: 0.8,                    
    landmarkConfidence: 0.9,            
    maxYaw: 15,                     
    maxPitch: 15,
    maxRoll: 15,
};

// Image Processing
export const CROP_SIZE = 224;

// UI Colors
export const DIAGNOSIS_COLORS = {
    Acne: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', hex: '#f43f5e' },
    Oily: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', hex: '#f59e0b' },
    Normal: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#10b981' },
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    ANALYZE: '/analyze',
    RESULTS: '/results',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    REGISTER: '/register',
    LIVECAM: '/analyze/live',
    UPLOAD: '/analyze/upload',
};
