import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type LocalMeal, type UserProfile, type LocalWeightLog } from './db';
import { syncOfflineData } from './sync';
import { localFoodDB, type FoodItem } from './localFoodDB';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE_URL = 'https://dietcoach-bff.onrender.com/api';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_982341',
  name: 'User',
  email: '',
  current_weight: 80,
  target_weight: 75,
  height: 180,
  goal: 'lose',
  calorie_target: 2000,
  protein_target: 150,
  carbs_target: 200,
  fat_target: 65,
  fiber_target: 25,
  satfat_target: 20,
  lift_weights: false,
  activity_level: 1.3,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function friendlyDate(date: Date): string {
  const today = getDateStr(new Date());
  const ds = getDateStr(date);
  if (ds === today) return 'Today';
  const yesterday = getDateStr(new Date(Date.now() - 86400000));
  if (ds === yesterday) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function App() {
  // ── Navigation ──
  const [activeTab, setActiveTab] = useState<'diary' | 'metrics' | 'coach' | 'settings'>('diary');

  // ── Date Navigation ──
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const dateStr = getDateStr(selectedDate);

  // ── Online / Sync ──
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // ── Toast ──
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Local Settings (localStorage) ──
  const [mealCount, setMealCount] = useState(() => parseInt(localStorage.getItem('dc_mealCount') || '4'));
  const [coachEnabled, setCoachEnabled] = useState(() => localStorage.getItem('dc_coachEnabled') === 'true');

  // ── Modal Visibility ──
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [amountFoodName, setAmountFoodName] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAIVision, setShowAIVision] = useState(false);
  const [showMealOptions, setShowMealOptions] = useState(false);
  const [showEraseAll, setShowEraseAll] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showMealCountModal, setShowMealCountModal] = useState(false);
  const [showCoachDisabled, setShowCoachDisabled] = useState(false);

  // ── Food Search State ──
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stagedMeal, setStagedMeal] = useState('Meal 1');

  // ── Barcode Scanner State ──
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const [stagedFood, setStagedFood] = useState<FoodItem | null>(null);
  const [amountGrams, setAmountGrams] = useState<number>(100);
  const [amountMeal, setAmountMeal] = useState('Meal 1');

  // ── Custom Food Form ──
  const [cfName, setCfName] = useState('');
  const [cfCals, setCfCals] = useState('');
  const [cfP, setCfP] = useState('');
  const [cfC, setCfC] = useState('');
  const [cfF, setCfF] = useState('');
  const [cfFiber, setCfFiber] = useState('');
  const [cfMeal, setCfMeal] = useState('Meal 1');

  // ── Metrics View ──
  const [logDate, setLogDate] = useState(() => getDateStr(new Date()));
  const [weightInput, setWeightInput] = useState('');
  const [bodyFatInput, setBodyFatInput] = useState('');
  const [waistInput, setWaistInput] = useState('');
  const [hipInput, setHipInput] = useState('');
  const [armInput, setArmInput] = useState('');
  const [upperBodyInput, setUpperBodyInput] = useState('');
  const [legInput, setLegInput] = useState('');
  const [progressPicInput, setProgressPicInput] = useState('');
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // ── Progress Picture Camera ──
  const progressVideoRef = useRef<HTMLVideoElement>(null);
  const [showProgressCamera, setShowProgressCamera] = useState(false);
  const [progressCameraStream, setProgressCameraStream] = useState<MediaStream | null>(null);
  const [progressFacingMode, setProgressFacingMode] = useState<'user' | 'environment'>('user');
  const [progressCameraError, setProgressCameraError] = useState<string | null>(null);

  // ── AI Vision ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedResult, setDetectedResult] = useState<any>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [aiStagedMeal, setAiStagedMeal] = useState('Meal 1');

  // ── Coach ──
  const [coachResponse, setCoachResponse] = useState<any>(null);
  const [isCoachRunning, setIsCoachRunning] = useState(false);

  // ── Meal Options ──
  const [mealOptionsTarget, setMealOptionsTarget] = useState('');
  const [copiedMeal, setCopiedMeal] = useState<LocalMeal[]>([]);

  // ── Nutrition Targets Form ──
  const [ntCal, setNtCal] = useState('');
  const [ntP, setNtP] = useState('');
  const [ntC, setNtC] = useState('');
  const [ntF, setNtF] = useState('');
  const [ntFiber, setNtFiber] = useState('');
  const [ntSatFat, setNtSatFat] = useState('');

  // ─── Dexie Live Queries ───────────────────────────────────────────────────
  const todayMeals = useLiveQuery(() =>
    db.meals.where('date').equals(dateStr).toArray(), [dateStr]
  ) || [];

  const allWeightLogs = useLiveQuery(() =>
    db.weightLogs.orderBy('date').reverse().toArray()
  ) || [];

  const localProfile = useLiveQuery(() => db.profile.get('usr_982341'));
  const profile = localProfile || DEFAULT_PROFILE;

  // ─── Computed Totals ──────────────────────────────────────────────────────
  const totals = todayMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
      fiber: acc.fiber + (m.fiber || 0),
      satfat: acc.satfat + (m.satfat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, satfat: 0 }
  );

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Seed profile if not exists
    db.profile.get('usr_982341').then(p => {
      if (!p) db.profile.put(DEFAULT_PROFILE);
    });

    const onOnline = () => { setIsOnline(true); doSync(); };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    doSync();
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (showAIVision && !imagePreviewUrl) startCamera();
    else if (!showAIVision) stopCamera();
    return () => { if (!showAIVision) stopCamera(); };
  }, [showAIVision]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    if (showProgressCamera) startProgressCamera();
    else stopProgressCamera();
    return () => stopProgressCamera();
  }, [showProgressCamera]);

  useEffect(() => {
    if (progressVideoRef.current) {
      progressVideoRef.current.srcObject = progressCameraStream;
    }
  }, [progressCameraStream]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/food/search?query=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setSearchResults(data);
            setIsSearching(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error searching live foods, falling back to local database:', err);
      }

      // Fallback to local offline database if API errors or returns 0 results
      const localMatches = localFoodDB.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 20);
      setSearchResults(localMatches);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function toast(msg: string) {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function doSync() {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    await syncOfflineData();
    setIsSyncing(false);
  }

  function getMealNames(): string[] {
    return Array.from({ length: mealCount }, (_, i) => `Meal ${i + 1}`);
  }

  // ─── Diary Logic ──────────────────────────────────────────────────────────
  function prevDay() {
    setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  }
  function nextDay() {
    setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  }

  function openFoodSearch(meal: string) {
    setStagedMeal(meal);
    setSearchQuery('');
    setShowFoodSearch(true);
  }

  function openAmountModal(food: FoodItem, meal: string) {
    setStagedFood(food);
    setAmountFoodName(food.name);
    setAmountGrams(100);
    setAmountMeal(meal);
    setShowFoodSearch(false);
    setShowAmountModal(true);
  }

  async function confirmAddFood() {
    if (!stagedFood || amountGrams <= 0) return;
    const mult = amountGrams / 100;
    await db.meals.add({
      name: amountFoodName.trim() || stagedFood.name,
      category: amountMeal,
      calories: parseFloat((stagedFood.cals * mult).toFixed(1)),
      protein: parseFloat((stagedFood.p * mult).toFixed(1)),
      carbs: parseFloat((stagedFood.c * mult).toFixed(1)),
      fat: parseFloat((stagedFood.f * mult).toFixed(1)),
      fiber: parseFloat((stagedFood.fiber * mult).toFixed(1)),
      satfat: parseFloat((stagedFood.satfat * mult).toFixed(1)),
      amount: amountGrams,
      date: dateStr,
      synced: 0,
    });
    setShowAmountModal(false);
    toast('Food Added!');
    doSync();
  }

  async function confirmAddCustomFood() {
    if (!cfName || !cfCals) return;
    await db.meals.add({
      name: cfName,
      category: cfMeal,
      calories: parseFloat(cfCals) || 0,
      protein: parseFloat(cfP) || 0,
      carbs: parseFloat(cfC) || 0,
      fat: parseFloat(cfF) || 0,
      fiber: parseFloat(cfFiber) || 0,
      satfat: 0,
      amount: 1,
      date: dateStr,
      synced: 0,
    });
    setShowCustomModal(false);
    setCfName(''); setCfCals(''); setCfP(''); setCfC(''); setCfF(''); setCfFiber('');
    toast('Custom Food Added!');
    doSync();
  }

  async function deleteFood(id: number) {
    await db.meals.delete(id);
    doSync();
  }

  function openMealOptions(meal: string) {
    setMealOptionsTarget(meal);
    setShowMealOptions(true);
  }

  function handleCopyMeal() {
    const mealFoods = todayMeals.filter(m => m.category === mealOptionsTarget);
    setCopiedMeal(mealFoods);
    setShowMealOptions(false);
    toast('Meal Copied!');
  }

  async function handlePasteMeal() {
    if (copiedMeal.length === 0) return;
    for (const food of copiedMeal) {
      await db.meals.add({ ...food, id: undefined, category: mealOptionsTarget, date: dateStr, synced: 0 });
    }
    setShowMealOptions(false);
    toast('Meal Pasted!');
  }

  async function handleClearMeal() {
    const mealFoods = todayMeals.filter(m => m.category === mealOptionsTarget);
    for (const f of mealFoods) if (f.id) await db.meals.delete(f.id);
    setShowMealOptions(false);
    toast('Meal Cleared!');
  }

  // ─── Metrics Logic ──────────────────────────────────────────────────────────
  function handleProgressPicChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProgressPicInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function startEditMetric(log: LocalWeightLog) {
    setEditingLogId(log.id || null);
    setLogDate(log.date);
    setWeightInput(String(log.weight));
    setBodyFatInput(log.body_fat !== undefined && log.body_fat !== null ? String(log.body_fat) : '');
    setWaistInput(log.waist !== undefined && log.waist !== null ? String(log.waist) : '');
    setHipInput(log.hip !== undefined && log.hip !== null ? String(log.hip) : '');
    setArmInput(log.arm !== undefined && log.arm !== null ? String(log.arm) : '');
    setUpperBodyInput(log.upper_body !== undefined && log.upper_body !== null ? String(log.upper_body) : '');
    setLegInput(log.leg !== undefined && log.leg !== null ? String(log.leg) : '');
    setProgressPicInput(log.progress_pic || '');
  }

  function clearMetricForm() {
    setEditingLogId(null);
    setLogDate(getDateStr(new Date()));
    setWeightInput('');
    setBodyFatInput('');
    setWaistInput('');
    setHipInput('');
    setArmInput('');
    setUpperBodyInput('');
    setLegInput('');
    setProgressPicInput('');
  }

  async function saveMetrics(e: React.FormEvent) {
    e.preventDefault();
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) {
      toast('Please enter a valid weight.');
      return;
    }

    const logData: Omit<LocalWeightLog, 'id'> = {
      weight: w,
      date: logDate,
      synced: 0,
      body_fat: bodyFatInput ? parseFloat(bodyFatInput) || undefined : undefined,
      waist: waistInput ? parseFloat(waistInput) || undefined : undefined,
      hip: hipInput ? parseFloat(hipInput) || undefined : undefined,
      arm: armInput ? parseFloat(armInput) || undefined : undefined,
      upper_body: upperBodyInput ? parseFloat(upperBodyInput) || undefined : undefined,
      leg: legInput ? parseFloat(legInput) || undefined : undefined,
      progress_pic: progressPicInput || undefined
    };

    if (editingLogId) {
      await db.weightLogs.update(editingLogId, logData);
      toast('Metrics updated!');
    } else {
      const existing = await db.weightLogs.where('date').equals(logDate).first();
      if (existing) {
        await db.weightLogs.update(existing.id!, logData);
      } else {
        await db.weightLogs.add(logData as any);
      }
      toast('Metrics logged!');
    }

    await db.profile.update('usr_982341', { current_weight: w });
    clearMetricForm();
    doSync();
  }

  async function deleteMetric(log: LocalWeightLog) {
    if (!confirm('Are you sure you want to delete this log?')) return;
    if (log.id) {
      await db.weightLogs.delete(log.id);
      if (navigator.onLine) {
        try {
          await fetch(`${API_BASE_URL}/weight?date=${log.date}`, { method: 'DELETE' });
        } catch (e) {
          console.error('Failed to delete on server:', e);
        }
      }
      toast('Log deleted!');
    }
  }

  // ── Progress Camera Logic ──
  async function startProgressCamera(facing = progressFacingMode) {
    setProgressCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera APIs are not supported or blocked (insecure HTTP context).');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 } }
      });
      setProgressCameraStream(stream);
      if (progressVideoRef.current) {
        progressVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Error starting progress camera:', err);
      let msg = 'Camera access denied. Please allow camera permissions.';
      if (!window.isSecureContext) {
        msg += ' Note: Your browser requires a secure connection (HTTPS) to access the camera on mobile devices.';
      }
      setProgressCameraError(msg);
    }
  }

  function stopProgressCamera() {
    if (progressCameraStream) {
      progressCameraStream.getTracks().forEach(track => track.stop());
      setProgressCameraStream(null);
    }
  }

  function captureProgressPhoto() {
    if (!progressVideoRef.current) return;
    const video = progressVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (progressFacingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setProgressPicInput(dataUrl);
    }
    stopProgressCamera();
    setShowProgressCamera(false);
    toast('Progress picture captured!');
  }

  async function toggleProgressFacingMode() {
    const nextFacing = progressFacingMode === 'user' ? 'environment' : 'user';
    setProgressFacingMode(nextFacing);
    if (progressCameraStream) {
      stopProgressCamera();
      setTimeout(() => startProgressCamera(nextFacing), 200);
    }
  }

  // ─── AI Vision Logic ──────────────────────────────────────────────────────
  async function startCamera() {
    setCameraError(null);
    setDetectedResult(null);
    setImagePreviewUrl(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera APIs are not supported or blocked (insecure HTTP context).');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err: any) {
      console.error('Error starting camera:', err);
      let msg = 'Camera access denied. Please allow camera permissions.';
      if (!window.isSecureContext) {
        msg += ' Note: Your browser requires a secure connection (HTTPS) to access the camera on mobile devices.';
      }
      setCameraError(msg);
    }
  }

  function stopCamera() {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null); }
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setImagePreviewUrl(URL.createObjectURL(blob));
      stopCamera();
      setIsAnalyzing(true);
      const formData = new FormData();
      formData.append('meal_image', blob, 'meal.jpg');
      formData.append('userId', 'usr_982341');
      formData.append('api_key', 'dummy');
      try {
        const res = await fetch(`${API_BASE_URL}/vision/analyze`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('AI service error');
        setDetectedResult(await res.json());
      } catch {
        setCameraError('Analysis failed. Check that the AI service is running.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 'image/jpeg', 0.85);
  }

  function adjustDetectedWeight(idx: number, delta: number) {
    if (!detectedResult) return;
    const items = [...detectedResult.items];
    const item = { ...items[idx] };
    const newWeight = Math.max(10, item.weight_g + delta);
    const scale = newWeight / item.weight_g;
    item.weight_g = newWeight;
    item.calories = parseFloat((item.calories * scale).toFixed(1));
    item.protein = parseFloat((item.protein * scale).toFixed(1));
    item.carbs = parseFloat((item.carbs * scale).toFixed(1));
    item.fat = parseFloat((item.fat * scale).toFixed(1));
    items[idx] = item;
    const total = items.reduce((a: any, i: any) => ({ calories: a.calories + i.calories, protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fat: a.fat + i.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    setDetectedResult({ ...detectedResult, items, meal_summary: { calories: parseFloat(total.calories.toFixed(1)), protein: parseFloat(total.protein.toFixed(1)), carbs: parseFloat(total.carbs.toFixed(1)), fat: parseFloat(total.fat.toFixed(1)) } });
  }

  async function confirmAIMeal() {
    if (!detectedResult) return;
    for (const item of detectedResult.items) {
      await db.meals.add({
        name: item.name,
        category: aiStagedMeal,
        calories: item.calories, protein: item.protein,
        carbs: item.carbs, fat: item.fat,
        fiber: 0, satfat: 0,
        amount: item.weight_g,
        date: dateStr, synced: 0,
      });
    }
    setShowAIVision(false);
    setDetectedResult(null);
    setImagePreviewUrl(null);
    toast('AI meal logged!');
    doSync();
  }

  // ─── Barcode Scanner Logic ────────────────────────────────────────────────
  async function startBarcodeScanner() {
    setScannerError(null);
    setIsScanningBarcode(true);
    // A short timeout ensures the barcode-reader div is rendered in the DOM before initialization
    setTimeout(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera APIs are not supported or blocked (insecure HTTP context).');
        }
        const html5QrCode = new Html5Qrcode("barcode-reader", {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.AZTEC,
            Html5QrcodeSupportedFormats.CODABAR,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.DATA_MATRIX,
            Html5QrcodeSupportedFormats.MAXICODE,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.PDF_417,
            Html5QrcodeSupportedFormats.RSS_14,
            Html5QrcodeSupportedFormats.RSS_EXPANDED,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION
          ],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
          }
        });
        html5QrcodeRef.current = html5QrCode;

        let cameraId: string | null = null;
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            const backCamera = devices.find(device => 
              device.label.toLowerCase().includes("back") || 
              device.label.toLowerCase().includes("rear") || 
              device.label.toLowerCase().includes("environment") ||
              device.label.toLowerCase().includes("spate")
            );
            cameraId = backCamera ? backCamera.id : devices[0].id;
          }
        } catch (e) {
          console.warn("Could not enumerate camera devices, falling back to facingMode constraint", e);
        }

        // Configure high-resolution (720p) video constraints so tiny barcodes are sharp enough to parse
        const videoConstraints: MediaTrackConstraints = cameraId ? {
          deviceId: { exact: cameraId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        };

        const config = { 
          fps: 15, // Higher frame rate for scanning speed
          qrbox: (width: number, height: number) => {
            // A wide scanning area optimized for barcodes, slightly taller on the y-axis
            const boxWidth = Math.floor(width * 0.85);
            const boxHeight = Math.floor(height * 0.45);
            return {
              width: boxWidth,
              height: boxHeight
            };
          },
          videoConstraints: videoConstraints
        };

        await html5QrCode.start(
          cameraId || { facingMode: "environment" },
          config,
          async (decodedText) => {
            await handleBarcodeDetected(decodedText);
          },
          () => {
            // Ignore verbose scanner logs
          }
        );

      } catch (err: any) {
        console.error("Error starting barcode scanner:", err);
        let msg = "Could not access camera. Please ensure camera permissions are granted.";
        if (!window.isSecureContext) {
          msg += " Note: Your browser requires a secure connection (HTTPS) to access the camera on mobile devices. If testing locally, deploy to HTTPS or enable unsafely-treat-insecure-origin-as-secure in Chrome flags.";
        }
        setScannerError(msg);
        setIsScanningBarcode(false);
      }
    }, 300);
  }

  async function stopBarcodeScanner() {
    if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
      } catch (err) {
        console.error("Error stopping barcode scanner:", err);
      }
    }
    html5QrcodeRef.current = null;
    setIsScanningBarcode(false);
  }

  async function handleBarcodeDetected(barcode: string) {
    await stopBarcodeScanner();
    setShowBarcodeScanner(false);
    toast("Product scanned! Searching...");
    
    try {
      const res = await fetch(`${API_BASE_URL}/food/barcode/${barcode}`);
      if (res.ok) {
        const foodItem = await res.json();
        openAmountModal(foodItem, stagedMeal);
      } else {
        toast("Product not found in database.");
      }
    } catch (err) {
      toast("Error connecting to server.");
    }
  }

  // ─── Coach Logic ──────────────────────────────────────────────────────────
  async function runCoach() {
    setIsCoachRunning(true);
    setCoachResponse(null);
    try {
      if (navigator.onLine) {
        await syncOfflineData();
      }
      const res = await fetch(`${API_BASE_URL}/coach/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'usr_982341' }),
      });
      if (!res.ok) throw new Error('Coach service unavailable');
      const data = await res.json();
      setCoachResponse(data);
      if (data.new_targets) {
        await db.profile.update('usr_982341', {
          calorie_target: data.new_targets.calories,
          protein_target: data.new_targets.protein,
          carbs_target: data.new_targets.carbs,
          fat_target: data.new_targets.fat,
          fiber_target: data.new_targets.fiber || 25,
          satfat_target: data.new_targets.satfat || 20,
        });
      }
      toast('Targets updated!');
    } catch {
      toast('Coach service offline. Start backend services first.');
    } finally {
      setIsCoachRunning(false);
    }
  }

  // ─── Settings Logic ───────────────────────────────────────────────────────
  function saveMealCount(count: number) {
    setMealCount(count);
    localStorage.setItem('dc_mealCount', String(count));
    setShowMealCountModal(false);
    toast('Saved!');
  }

  function saveCoachEnabled(val: boolean) {
    setCoachEnabled(val);
    localStorage.setItem('dc_coachEnabled', String(val));
  }

  async function applyNutritionTargets() {
    const inputCalNum = parseFloat(ntCal) || 0;
    const pCal = (parseFloat(ntP) || 0) * 4;
    const cCal = (parseFloat(ntC) || 0) * 4;
    const fCal = (parseFloat(ntF) || 0) * 9;
    const calculatedCals = Math.round(pCal + cCal + fCal);
    if (Math.abs(calculatedCals - inputCalNum) > 5) {
      toast('Error: Macro calories must match target calories.');
      return;
    }
    await db.profile.update('usr_982341', {
      calorie_target: parseFloat(ntCal) || profile.calorie_target,
      protein_target: parseFloat(ntP) || profile.protein_target,
      carbs_target: parseFloat(ntC) || profile.carbs_target,
      fat_target: parseFloat(ntF) || profile.fat_target,
      fiber_target: parseFloat(ntFiber) || profile.fiber_target,
      satfat_target: parseFloat(ntSatFat) || profile.satfat_target,
    });
    setShowNutritionModal(false);
    toast('Targets updated!');
  }

  async function eraseAll() {
    await db.meals.clear();
    await db.weightLogs.clear();
    await db.profile.put(DEFAULT_PROFILE);
    setShowEraseAll(false);
    toast('All data erased.');
  }

  // ─── Computed values ──────────────────────────────────────────────────────
  const pct = (val: number, target: number) => target > 0 ? Math.min((val / target) * 100, 100) : 0;

  const inputCalNum = parseFloat(ntCal) || 0;
  const pCal = (parseFloat(ntP) || 0) * 4;
  const cCal = (parseFloat(ntC) || 0) * 4;
  const fCal = (parseFloat(ntF) || 0) * 9;
  const calculatedCals = Math.round(pCal + cCal + fCal);
  const calsDiff = Math.abs(calculatedCals - inputCalNum);
  const isCalsValid = calsDiff <= 5;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="app-views-wrapper">

      {/* ── Toast ── */}
      <div id="toast" className={`toast${toastVisible ? '' : ' hidden'}`}>{toastMsg}</div>

      {/* ── Header ── */}
      <header className="app-header">
        <h1>Diet<span>Coach AI</span></h1>
        <p id="header-subtitle">
          {isOnline
            ? (isSyncing ? 'Syncing...' : 'Nutrition Tracking & Body Composition Tool')
            : 'Offline Mode — Data Saved Locally'}
        </p>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          VIEW: DIARY
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'diary' && (
        <main className="app-view active-view animate-fade">
          <div className="view-container">

            {/* Date Navigation */}
            <div className="panel date-header">
              <button className="icon-btn" onClick={prevDay}>
                <span className="material-icons">chevron_left</span>
              </button>
              <h2 className="date-title">{friendlyDate(selectedDate)}</h2>
              <button className="icon-btn" onClick={nextDay}>
                <span className="material-icons">chevron_right</span>
              </button>
            </div>

            {/* Calorie Summary */}
            <div className="panel summary-panel">
              <h3>Calories</h3>
              <div className="cal-summary">
                <span className="cal-number text-small">{Math.round(profile.calorie_target)}</span>
                <span className="cal-label">-</span>
                <span className="cal-number text-small">{Math.round(totals.calories)}</span>
                <span className="cal-label">=</span>
                <span className="cal-number">{Math.round(profile.calorie_target - totals.calories)}</span>
              </div>
              <div className="macros-progress">
                <div className="macro-prog">
                  <div className="flex-between">
                    <span>Protein Target</span>
                    <span>{Math.round(totals.protein)} / {profile.protein_target}g</span>
                  </div>
                  <div className="prog-bar bg-p">
                    <div className="prog-fill" style={{ width: `${pct(totals.protein, profile.protein_target)}%` }} />
                  </div>
                </div>
                <div className="macro-prog">
                  <div className="flex-between">
                    <span>Carbs Target</span>
                    <span>{Math.round(totals.carbs)} / {profile.carbs_target}g</span>
                  </div>
                  <div className="prog-bar bg-c">
                    <div className="prog-fill" style={{ width: `${pct(totals.carbs, profile.carbs_target)}%` }} />
                  </div>
                </div>
                <div className="macro-prog">
                  <div className="flex-between">
                    <span>Fats Target</span>
                    <span>{Math.round(totals.fat)} / {profile.fat_target}g</span>
                  </div>
                  <div className="prog-bar bg-f">
                    <div className="prog-fill" style={{ width: `${pct(totals.fat, profile.fat_target)}%` }} />
                  </div>
                </div>
                <div className="macro-prog">
                  <div className="flex-between">
                    <span>Fiber Target</span>
                    <span>{Math.round(totals.fiber)} / {profile.fiber_target}g</span>
                  </div>
                  <div className="prog-bar" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)' }}>
                    <div className="prog-fill" style={{ width: `${pct(totals.fiber, profile.fiber_target)}%`, background: '#34d399' }} />
                  </div>
                </div>
                <div className="macro-prog">
                  <div className="flex-between">
                    <span>Sat. Fat Target (max)</span>
                    <span>{Math.round(totals.satfat)} / {profile.satfat_target}g</span>
                  </div>
                  <div className="prog-bar" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)' }}>
                    <div className="prog-fill" style={{ width: `${pct(totals.satfat, profile.satfat_target)}%`, background: '#a855f7' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Groups */}
            <div className="panel">
              <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>Logged Foods</h3>
              </div>
              {getMealNames().map(mealName => {
                const mealFoods = todayMeals.filter(f => f.category === mealName);
                const mCals = mealFoods.reduce((s, f) => s + f.calories, 0);
                const mP = mealFoods.reduce((s, f) => s + f.protein, 0);
                const mC = mealFoods.reduce((s, f) => s + f.carbs, 0);
                const mF = mealFoods.reduce((s, f) => s + f.fat, 0);
                return (
                  <div className="meal-group" key={mealName}>
                    <div className="meal-header">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h4>{mealName}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="material-icons" style={{ cursor: 'pointer', fontSize: '22px' }}
                            onClick={() => openFoodSearch(mealName)}>add_circle_outline</span>
                          <span className="material-icons" style={{ cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}
                            onClick={() => openMealOptions(mealName)}>more_vert</span>
                        </div>
                      </div>
                      {mealFoods.length > 0 && (
                        <div className="meal-summary-row">
                          {Math.round(mCals)} kcal • P: {Math.round(mP)}g • C: {Math.round(mC)}g • F: {Math.round(mF)}g
                        </div>
                      )}
                    </div>
                    <ul className="food-log-list">
                      {mealFoods.length === 0 ? (
                        <li className="empty-state" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>No entries.</li>
                      ) : mealFoods.map(food => (
                        <li key={food.id}>
                          <div className="flex-between">
                            <strong style={{ fontSize: '0.92rem' }}>{food.name}</strong>
                            <strong>{Math.round(food.calories)} kcal</strong>
                          </div>
                          <div className="food-meta">
                            <span>{food.amount}g</span>
                            <span>P: {Math.round(food.protein)}g | C: {Math.round(food.carbs)}g | F: {Math.round(food.fat)}g</span>
                            <span className="material-icons" style={{ marginLeft: 'auto', fontSize: '16px', color: '#f87171', cursor: 'pointer' }}
                              onClick={() => food.id && deleteFood(food.id)}>delete</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

          </div>
        </main>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW: WEIGHT
          ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════
          VIEW: METRICS
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'metrics' && (
        <main className="app-view active-view animate-fade">
          <div className="view-container">
            <div className="panel">
              <h2>{editingLogId ? 'Edit Metrics' : 'Log Metrics'}</h2>
              <form onSubmit={saveMetrics}>
                <div className="form-grid" style={{ gap: '0.85rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label>Date</label>
                      <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input type="number" step="0.1" value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="0.0" />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label>Body Fat (%)</label>
                      <input type="number" step="0.1" value={bodyFatInput} onChange={e => setBodyFatInput(e.target.value)} placeholder="0.0" />
                    </div>
                    <div className="form-group">
                      <label>Waist (cm)</label>
                      <input type="number" step="0.1" value={waistInput} onChange={e => setWaistInput(e.target.value)} placeholder="0.0" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label>Hip (cm)</label>
                      <input type="number" step="0.1" value={hipInput} onChange={e => setHipInput(e.target.value)} placeholder="0.0" />
                    </div>
                    <div className="form-group">
                      <label>Arm (cm)</label>
                      <input type="number" step="0.1" value={armInput} onChange={e => setArmInput(e.target.value)} placeholder="0.0" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label>Upper Body (cm)</label>
                      <input type="number" step="0.1" value={upperBodyInput} onChange={e => setUpperBodyInput(e.target.value)} placeholder="0.0" />
                    </div>
                    <div className="form-group">
                      <label>Leg (cm)</label>
                      <input type="number" step="0.1" value={legInput} onChange={e => setLegInput(e.target.value)} placeholder="0.0" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Progress Picture</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <input type="file" accept="image/*" onChange={handleProgressPicChange} style={{ display: 'none' }} id="progress-pic-file" />
                      <button type="button" className="secondary-btn" onClick={() => document.getElementById('progress-pic-file')?.click()} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                        <span className="material-icons" style={{ fontSize: '18px', marginRight: '0.25rem', verticalAlign: 'middle' }}>file_upload</span>
                        Upload Image
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => setShowProgressCamera(true)} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                        <span className="material-icons" style={{ fontSize: '18px', marginRight: '0.25rem', verticalAlign: 'middle' }}>photo_camera</span>
                        Take Photo
                      </button>
                      {progressPicInput && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={progressPicInput} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                          <button type="button" className="secondary-btn" onClick={() => setProgressPicInput('')} style={{ padding: '0.2rem', color: '#f87171' }}>
                            <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                  {editingLogId && (
                    <button type="button" className="secondary-btn" style={{ flex: 1 }} onClick={clearMetricForm}>Cancel</button>
                  )}
                  <button className="primary-btn" type="submit" style={{ flex: 1 }}>
                    {editingLogId ? 'Update Log' : 'Save Metrics'}
                  </button>
                </div>
              </form>
            </div>

            <div className="panel">
              <h3>Historical Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                {allWeightLogs.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No metrics logged yet.</p>
                ) : (
                  allWeightLogs.map((log) => (
                    <div key={log.id || log.date} className="metric-log-card" style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div className="flex-between">
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.date}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {!log.synced && <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', padding: '0.1rem 0.3rem', borderRadius: '3px', border: '1px solid var(--border-subtle)' }}>LOCAL</span>}
                          <span className="material-icons" style={{ cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
                            onClick={() => startEditMetric(log)}>edit</span>
                          <span className="material-icons" style={{ cursor: 'pointer', fontSize: '18px', color: '#f87171' }}
                            onClick={() => deleteMetric(log)}>delete</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <div>Weight: <strong>{log.weight.toFixed(1)} kg</strong></div>
                        {log.body_fat !== undefined && log.body_fat !== null && <div>Body Fat: <strong>{log.body_fat.toFixed(1)}%</strong></div>}
                        {log.waist !== undefined && log.waist !== null && <div>Waist: <strong>{log.waist.toFixed(1)} cm</strong></div>}
                        {log.hip !== undefined && log.hip !== null && <div>Hip: <strong>{log.hip.toFixed(1)} cm</strong></div>}
                        {log.arm !== undefined && log.arm !== null && <div>Arm: <strong>{log.arm.toFixed(1)} cm</strong></div>}
                        {log.upper_body !== undefined && log.upper_body !== null && <div>Upper Body: <strong>{log.upper_body.toFixed(1)} cm</strong></div>}
                        {log.leg !== undefined && log.leg !== null && <div>Leg: <strong>{log.leg.toFixed(1)} cm</strong></div>}
                      </div>

                      {log.progress_pic && (
                        <div style={{ marginTop: '0.25rem' }}>
                          <img src={log.progress_pic} alt="Progress" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                            onClick={() => setZoomedImage(log.progress_pic || null)} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW: COACH
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'coach' && (
        <main className="app-view active-view animate-fade">
          <div className="view-container">
            <div className="panel">
              <div className="flex-between">
                <div>
                  <h2 style={{ marginBottom: '0.1rem' }}>Coach</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analyzing past 14 days of data</p>
                </div>
                <span className="material-icons" style={{ fontSize: '2.5rem', opacity: 0.35 }}>psychology</span>
              </div>
            </div>

            <div className="panel">
              <h3>Adaptive AI Coach</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Unlike static calculators, the AI Coach analyzes the correlation between your logged weight and calorie intake.
                It recalculates your real metabolic rate (adaptive TDEE) and dynamically adjusts next week's targets.
              </p>
              <div className="micros-grid" style={{ marginBottom: '1rem' }}>
                <div className="micro-row">
                  <span>Current Weight</span>
                  <strong>{profile.current_weight} kg</strong>
                </div>
                <div className="divider" />
                <div className="micro-row">
                  <span>Calorie Target</span>
                  <strong>{profile.calorie_target} kcal</strong>
                </div>
                <div className="micro-row">
                  <span>Goal</span>
                  <strong style={{ textTransform: 'capitalize' }}>{profile.goal}</strong>
                </div>
              </div>
              <button className="primary-btn" style={{ width: '100%' }} onClick={runCoach} disabled={isCoachRunning}>
                {isCoachRunning ? 'Calculating...' : 'Recalculate Weekly Targets'}
              </button>

              {!coachEnabled && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.75rem', textAlign: 'center' }}>
                  Enable Coach Mode in Settings to auto-apply adjustments.
                </p>
              )}
            </div>

            {coachResponse && (
              <div className="panel animate-slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {coachResponse.coach_status === 'low_compliance' ? (
                    <>
                      <span className="material-icons" style={{ color: '#ef4444', fontSize: '20px' }}>warning</span>
                      <strong style={{ color: '#ef4444' }}>Targets Not Adjusted (Low Compliance)</strong>
                    </>
                  ) : coachResponse.coach_status === 'on_track' ? (
                    <>
                      <span className="material-icons" style={{ color: '#3b82f6', fontSize: '20px' }}>trending_up</span>
                      <strong style={{ color: '#3b82f6' }}>Targets Maintained (On Track!)</strong>
                    </>
                  ) : (
                    <>
                      <span className="material-icons" style={{ color: '#34d399', fontSize: '20px' }}>check_circle</span>
                      <strong>{coachResponse.coach_status === 'estimation' ? 'Initial Targets Estimated' : 'Targets Adjusted'}</strong>
                    </>
                  )}
                </div>
                
                <div className="micros-grid" style={{ marginBottom: '1rem' }}>
                  <div className="micro-row">
                    <span>Coach Mode</span>
                    <strong style={{ textTransform: 'capitalize' }}>
                      {coachResponse.coach_status === 'estimation' ? 'Estimation (BMR)' : 'Adaptive AI'}
                    </strong>
                  </div>
                  <div className="micro-row">
                    <span>TDEE</span>
                    <strong>{coachResponse.tdee} kcal</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem' }}>
                  {coachResponse.coach_status === 'estimation' && (
                    <p style={{ margin: 0 }}>
                      Calculated initial targets using BMR ({22 * (profile.current_weight || 80)} kcal) × activity level ({profile.activity_level || 1.3}). 
                      Adaptive mode will unlock when you have at least 7 days of weight logs (current: {coachResponse.weight_days_logged}/7) and 7 days of meals (current: {coachResponse.meal_days_logged}/7).
                    </p>
                  )}
                  {coachResponse.coach_status === 'low_compliance' && (
                    <p style={{ margin: 0 }}>
                      Weekly targets were not adjusted because your food logging consistency was low. You logged {coachResponse.meal_days_last_7} of the last 7 days (target &gt;= 6), and your average calories deviated by {coachResponse.calorie_deviation_pct}% from your target (target &lt;= 15%). Please log consistently to enable target adjustments.
                    </p>
                  )}
                  {coachResponse.coach_status === 'on_track' && (
                    <p style={{ margin: 0 }}>
                      You are making great progress towards your goal! Since your weight change matches your target rate, your calorie goals have been maintained. Keep doing what you're doing!
                    </p>
                  )}
                  {coachResponse.coach_status === 'stalled_adjusted' && (
                    <p style={{ margin: 0 }}>
                      Your progress has stalled or drifted. The AI Coach has adjusted your calorie and macro targets using your calculated TDEE ({coachResponse.tdee} kcal) to help you break the plateau.
                    </p>
                  )}
                </div>

                <h3 className="section-title">New Daily Targets</h3>
                <div className="macros-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="macro-card">
                    <div className="macro-header"><div className="dot" style={{ background: '#fafafa' }} /><span>Calories</span></div>
                    <div className="macro-grams">{coachResponse.new_targets?.calories}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>was {coachResponse.previous_targets?.calories}</div>
                  </div>
                  <div className="macro-card protein">
                    <div className="macro-header"><div className="dot" /><span>Protein</span></div>
                    <div className="macro-grams">{coachResponse.new_targets?.protein}g</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>was {coachResponse.previous_targets?.protein}g</div>
                  </div>
                  <div className="macro-card carbs">
                    <div className="macro-header"><div className="dot" /><span>Carbs</span></div>
                    <div className="macro-grams">{coachResponse.new_targets?.carbs}g</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>was {coachResponse.previous_targets?.carbs}g</div>
                  </div>
                  <div className="macro-card fats">
                    <div className="macro-header"><div className="dot" /><span>Fats</span></div>
                    <div className="macro-grams">{coachResponse.new_targets?.fat}g</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>was {coachResponse.previous_targets?.fat}g</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          VIEW: SETTINGS
          ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <section className="app-view active-view animate-fade">
          <div className="view-container">
            <div className="panel">
              <h2 className="section-title">User Profile</h2>
              <div className="form-grid">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={profile.name}
                      onChange={e => db.profile.update('usr_982341', { name: e.target.value })}
                      placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Goal</label>
                    <select value={profile.goal} onChange={e => db.profile.update('usr_982341', { goal: e.target.value })}>
                      <option value="lose">Fat loss</option>
                      <option value="maintain">Maintain</option>
                      <option value="gain">Gain Mass</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Initial Weight (kg)</label>
                    <input type="number" step="0.1" value={profile.current_weight}
                      onChange={e => db.profile.update('usr_982341', { current_weight: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label>Lift Weights</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', minHeight: '46px' }}>
                      <label className="switch">
                        <input type="checkbox" checked={!!profile.lift_weights}
                          onChange={e => db.profile.update('usr_982341', { lift_weights: e.target.checked })} />
                        <span className="slider" />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Activity Level</label>
                    <select value={profile.activity_level || 1.3} onChange={e => db.profile.update('usr_982341', { activity_level: parseFloat(e.target.value) || 1.3 })}>
                      <option value={1.3}>Sedentary (1.3)</option>
                      <option value={1.45}>Lightly Active (1.45)</option>
                      <option value={1.6}>Active (1.6)</option>
                      <option value={1.8}>Very Active (1.8)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2 className="section-title">App Configuration</h2>
              <div className="settings-options-list">

                <div className="settings-option-item" style={{ cursor: 'default' }}>
                  <div className="flex-between">
                    <div className="option-info">
                      <span className="material-icons">psychology</span>
                      <div>
                        <strong>Coach Mode</strong>
                        <p>Data-driven calorie and macro adjustments</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={coachEnabled} onChange={e => saveCoachEnabled(e.target.checked)} />
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <div className="settings-option-item" onClick={() => setShowMealCountModal(true)}>
                  <div className="flex-between">
                    <div className="option-info">
                      <span className="material-icons">restaurant</span>
                      <div>
                        <strong>Daily Meals</strong>
                        <p>{mealCount} Meals</p>
                      </div>
                    </div>
                    <span className="material-icons">chevron_right</span>
                  </div>
                </div>

                <div className="settings-option-item" onClick={() => {
                  setNtCal(String(profile.calorie_target)); setNtP(String(profile.protein_target));
                  setNtC(String(profile.carbs_target)); setNtF(String(profile.fat_target));
                  setNtFiber(String(profile.fiber_target)); setNtSatFat(String(profile.satfat_target));
                  setShowNutritionModal(true);
                }}>
                  <div className="flex-between">
                    <div className="option-info">
                      <span className="material-icons">tune</span>
                      <div>
                        <strong>Manual Nutrition Targets</strong>
                        <p>Modify goals for calories and macros</p>
                      </div>
                    </div>
                    <span className="material-icons">chevron_right</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="panel">
              <h2 className="section-title">Data Management</h2>
              <div className="settings-options-list">
                <div className="settings-option-item" onClick={() => setShowEraseAll(true)}>
                  <div className="flex-between">
                    <div className="option-info">
                      <span className="material-icons" style={{ color: '#f87171' }}>delete_forever</span>
                      <div>
                        <strong style={{ color: '#f87171' }}>Erase All Account Data</strong>
                        <p>Remove all food, weight & coach logs</p>
                      </div>
                    </div>
                    <span className="material-icons">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ textAlign: 'center', paddingBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
              DietCoach v2.0 — AI-Powered Nutrition
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM TAB BAR
          ═══════════════════════════════════════════════════════════════ */}
      <nav className="bottom-tab-bar">
        <button className={`tab-item${activeTab === 'diary' ? ' active' : ''}`} onClick={() => setActiveTab('diary')}>
          <span className="material-icons">book</span>
          <span className="tab-label">Diary</span>
        </button>
        <button className={`tab-item${activeTab === 'metrics' ? ' active' : ''}`} onClick={() => setActiveTab('metrics')}>
          <span className="material-icons">query_stats</span>
          <span className="tab-label">Metrics</span>
        </button>
        <button className={`tab-item${activeTab === 'coach' ? ' active' : ''}`} onClick={() => {
          if (!coachEnabled) { setShowCoachDisabled(true); return; }
          setActiveTab('coach');
        }}>
          <span className="material-icons">psychology</span>
          <span className="tab-label">Coach</span>
        </button>
        <button className={`tab-item${activeTab === 'settings' ? ' active' : ''}`} onClick={() => setActiveTab('settings')}>
          <span className="material-icons">settings</span>
          <span className="tab-label">Settings</span>
        </button>
      </nav>


      {/* ═══════════════════════════════════════════════════════════════
          MODALS
          ═══════════════════════════════════════════════════════════════ */}

      {/* ── Food Search Modal ── */}
      {showFoodSearch && (
        <div className="modal-overlay">
          <div className="modal-card panel" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1rem', flexShrink: 0 }}>
              <h3 style={{ margin: 0 }}>Search Food</h3>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => setShowFoodSearch(false)}>close</span>
            </div>
            <div className="search-input-group" style={{ flexShrink: 0 }}>
              <span className="material-icons search-icon-abs">search</span>
              <input type="text" placeholder="Search USDA & Open Food Facts..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} autoFocus />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginTop: '0.5rem', flexShrink: 0 }}>
              <button className="secondary-btn" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.5rem 0.2rem' }}
                onClick={() => { setShowFoodSearch(false); setCfMeal(stagedMeal); setShowCustomModal(true); }}>
                <span className="material-icons" style={{ fontSize: '16px' }}>add</span> Custom Food
              </button>
              <button className="secondary-btn" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.5rem 0.2rem' }}
                onClick={() => { setShowFoodSearch(false); setShowBarcodeScanner(true); startBarcodeScanner(); }}>
                <span className="material-icons" style={{ fontSize: '16px' }}>qr_code_scanner</span> Scan Barcode
              </button>
              <button className="secondary-btn" style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.5rem 0.2rem' }}
                onClick={() => { setShowFoodSearch(false); setAiStagedMeal(stagedMeal); setShowAIVision(true); }}>
                <span className="material-icons" style={{ fontSize: '16px' }}>photo_camera</span> AI Photo
              </button>
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto', marginTop: '0.75rem' }}>
              {isSearching && (
                <p className="empty-state" style={{ color: 'var(--text-secondary)' }}>Searching USDA & Open Food Facts...</p>
              )}
              {!isSearching && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                <p className="empty-state">No foods found in external databases.</p>
              )}
              {searchQuery.trim().length < 2 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  Type at least 2 characters to search foods live…
                </p>
              )}
              <ul className="results-list" style={{ marginTop: 0 }}>
                {searchResults.map(food => (
                  <li key={food.name} onClick={() => openAmountModal(food, stagedMeal)}>
                    <div className="flex-between" style={{ pointerEvents: 'none' }}>
                      <strong style={{ fontSize: '0.92rem' }}>{food.name}</strong>
                      <span style={{ fontSize: '0.85rem' }}>{Math.round(food.cals)} kcal</span>
                    </div>
                    <div className="food-meta" style={{ pointerEvents: 'none' }}>
                      <span>P: {Math.round(food.p)}g | C: {Math.round(food.c)}g | F: {Math.round(food.f)}g</span>
                      <span style={{ marginLeft: 'auto' }}>per 100g</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Amount Modal ── */}
      {showAmountModal && stagedFood && (
        <div className="modal-overlay">
          <div className="modal-card panel">
            <h3 style={{ marginBottom: '0.25rem' }}>Log Food</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Base: 100g = {Math.round(stagedFood.cals)} kcal
            </p>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Food Name</label>
              <input type="text" value={amountFoodName} onChange={e => setAmountFoodName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Amount Eaten (grams)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="number" value={amountGrams} onChange={e => setAmountGrams(parseFloat(e.target.value) || 0)}
                  style={{ flex: 1 }} autoFocus />
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>g</span>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label>Add to Meal</label>
              <select value={amountMeal} onChange={e => setAmountMeal(e.target.value)}>
                {getMealNames().map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setShowAmountModal(false)}>Cancel</button>
              <button className="primary-btn" style={{ flex: 1 }} onClick={confirmAddFood}>Log Food</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom Food Modal ── */}
      {showCustomModal && (
        <div className="modal-overlay">
          <div className="modal-card panel">
            <h3>Add Custom Macros</h3>
            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label>Food Name</label>
              <input type="text" value={cfName} onChange={e => setCfName(e.target.value)} placeholder="e.g. My Protein Shake" autoFocus />
            </div>
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label>Add to Meal</label>
              <select value={cfMeal} onChange={e => setCfMeal(e.target.value)}>
                {getMealNames().map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div className="form-group"><label>Calories</label><input type="number" value={cfCals} onChange={e => setCfCals(e.target.value)} /></div>
              <div className="form-group"><label>Protein (g)</label><input type="number" value={cfP} onChange={e => setCfP(e.target.value)} /></div>
              <div className="form-group"><label>Carbs (g)</label><input type="number" value={cfC} onChange={e => setCfC(e.target.value)} /></div>
              <div className="form-group"><label>Fats (g)</label><input type="number" value={cfF} onChange={e => setCfF(e.target.value)} /></div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Fiber (g) — optional</label><input type="number" value={cfFiber} onChange={e => setCfFiber(e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setShowCustomModal(false)}>Cancel</button>
              <button className="primary-btn" style={{ flex: 1 }} onClick={confirmAddCustomFood}>Add to Diary</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Meal Options Modal ── */}
      {showMealOptions && (
        <div className="modal-overlay">
          <div className="modal-card panel">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>{mealOptionsTarget} Options</h3>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => setShowMealOptions(false)}>close</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="secondary-btn" style={{ width: '100%', textAlign: 'left', paddingLeft: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                onClick={handleCopyMeal}>
                <span className="material-icons" style={{ fontSize: '1.1rem' }}>content_copy</span> Copy Meal
              </button>
              {copiedMeal.length > 0 && (
                <button className="secondary-btn" style={{ width: '100%', textAlign: 'left', paddingLeft: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                  onClick={handlePasteMeal}>
                  <span className="material-icons" style={{ fontSize: '1.1rem' }}>content_paste</span> Paste Copied Meal
                </button>
              )}
              <div className="divider" />
              <button className="secondary-btn" style={{ width: '100%', textAlign: 'left', paddingLeft: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                onClick={handleClearMeal}>
                <span className="material-icons" style={{ fontSize: '1.1rem' }}>delete_outline</span> Clear Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Vision Modal ── */}
      {showAIVision && (
        <div className="modal-overlay">
          <div className="modal-card panel" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>AI Photo Logging</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Analyzed via OpenCV + GPT-4o Vision</p>
              </div>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => { setShowAIVision(false); setDetectedResult(null); setImagePreviewUrl(null); }}>close</span>
            </div>

            {cameraError && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#f87171' }}>
                {cameraError}
              </div>
            )}

            <div className="camera-container" style={{ marginBottom: '1rem' }}>
              {!imagePreviewUrl && (
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraStream ? 'block' : 'none' }} />
              )}
              {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Meal capture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {isAnalyzing && (
                <div className="ai-overlay">
                  <span className="material-icons" style={{ fontSize: '2.5rem', color: 'var(--text-primary)', opacity: 0.8 }}>psychology</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Analyzing with AI Vision…</p>
                </div>
              )}
              {!cameraStream && !imagePreviewUrl && !isAnalyzing && (
                <div className="ai-overlay">
                  <span className="material-icons" style={{ fontSize: '2.5rem', color: 'var(--text-secondary)' }}>photo_camera</span>
                  <button className="primary-btn" onClick={startCamera} style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}>Start Camera</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {cameraStream && (
                <button className="primary-btn" style={{ flex: 1 }} onClick={capturePhoto}>
                  <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '0.25rem' }}>photo_camera</span>
                  Capture & Analyze
                </button>
              )}
              {imagePreviewUrl && !isAnalyzing && (
                <button className="secondary-btn" onClick={() => { setImagePreviewUrl(null); setDetectedResult(null); startCamera(); }}>
                  Retake
                </button>
              )}
            </div>

            {detectedResult && (
              <>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label>Add to Meal</label>
                  <select value={aiStagedMeal} onChange={e => setAiStagedMeal(e.target.value)}>
                    {getMealNames().map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '0.75rem' }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>AI Meal Summary</strong>
                    <strong style={{ color: 'var(--text-primary)' }}>{Math.round(detectedResult.meal_summary.calories)} kcal</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    P: {Math.round(detectedResult.meal_summary.protein)}g · C: {Math.round(detectedResult.meal_summary.carbs)}g · F: {Math.round(detectedResult.meal_summary.fat)}g
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {detectedResult.items.map((item: any, idx: number) => (
                    <div className="detected-item" key={idx}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 500, textTransform: 'capitalize' }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{item.weight_g}g · {Math.round(item.calories)} kcal</div>
                      </div>
                      <div className="detected-item-adjust">
                        <button className="adj-btn" onClick={() => adjustDetectedWeight(idx, -10)}>-10g</button>
                        <button className="adj-btn" onClick={() => adjustDetectedWeight(idx, 10)}>+10g</button>
                        <button className="adj-btn" onClick={() => adjustDetectedWeight(idx, 50)}>+50g</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="primary-btn" style={{ width: '100%' }} onClick={confirmAIMeal}>
                  <span className="material-icons" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '0.25rem' }}>check</span>
                  Add to Diary
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Nutrition Targets Modal ── */}
      {showNutritionModal && (
        <div className="modal-overlay">
          <div className="modal-card panel" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <h3>Manual Nutrition Targets</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Override automated calculator results.</p>
            <div className="form-grid" style={{ gap: '0.85rem' }}>
              <div className="form-group">
                <label>Calories</label>
                <input type="number" value={ntCal} onChange={e => setNtCal(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group"><label>Protein (g)</label><input type="number" value={ntP} onChange={e => setNtP(e.target.value)} /></div>
                <div className="form-group"><label>Carbs (g)</label><input type="number" value={ntC} onChange={e => setNtC(e.target.value)} /></div>
                <div className="form-group"><label>Fats (g)</label><input type="number" value={ntF} onChange={e => setNtF(e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div className="form-group"><label>Fiber (g)</label><input type="number" value={ntFiber} onChange={e => setNtFiber(e.target.value)} /></div>
                <div className="form-group"><label>Sat. Fat (g)</label><input type="number" value={ntSatFat} onChange={e => setNtSatFat(e.target.value)} /></div>
              </div>
            </div>

            {!isCalsValid && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
                  <span className="material-icons" style={{ fontSize: '16px !important' }}>
                    error
                  </span>
                  <span>
                    Macros do not match Calories
                  </span>
                </div>
                <div>
                  Macro Calorie Sum: <strong>{calculatedCals} kcal</strong> ({ntP || 0}g × 4 + {ntC || 0}g × 4 + {ntF || 0}g × 9)
                  <br />
                  Target Calories: <strong>{inputCalNum} kcal</strong>
                  <span style={{ display: 'block', marginTop: '0.2rem', color: '#ef4444', fontWeight: 500 }}>
                    Difference must be 5 kcal or less (currently {calsDiff} kcal difference).
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setShowNutritionModal(false)}>Cancel</button>
              <button className="primary-btn" style={{ flex: 1 }} onClick={applyNutritionTargets} disabled={!isCalsValid}>Apply Targets</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Meal Count Modal ── */}
      {showMealCountModal && (
        <div className="modal-overlay">
          <div className="modal-card panel">
            <h3>Number of Daily Meals</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Choose how many meal sections show in your Diary.</p>
            <div className="form-group">
              <label>Daily Meal Count</label>
              <select value={mealCount} onChange={e => setMealCount(parseInt(e.target.value))}>
                {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Meals</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setShowMealCountModal(false)}>Cancel</button>
              <button className="primary-btn" style={{ flex: 1 }} onClick={() => saveMealCount(mealCount)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Coach Disabled Modal ── */}
      {showCoachDisabled && (
        <div className="modal-overlay">
          <div className="modal-card panel">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Coach is Disabled</h3>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => setShowCoachDisabled(false)}>close</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Coach is currently disabled. Go to <strong style={{ color: 'var(--text-primary)' }}>Settings → App Configuration</strong> and turn on Coach Mode.
            </p>
            <button className="primary-btn" style={{ width: '100%' }} onClick={() => { setShowCoachDisabled(false); setActiveTab('settings'); }}>
              Go to Settings
            </button>
          </div>
        </div>
      )}

      {/* ── Erase All Modal ── */}
      {showEraseAll && (
        <div className="modal-overlay">
          <div className="modal-card panel">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#f87171' }}>Erase All Data</h3>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => setShowEraseAll(false)}>close</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              This will permanently erase <strong style={{ color: 'var(--text-primary)' }}>all</strong> food logs, weight logs, and Coach history. Your profile and nutrition targets will also be reset.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginBottom: 0 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setShowEraseAll(false)}>Cancel</button>
              <button className="primary-btn" style={{ flex: 1, background: '#f87171', borderColor: '#f87171' }} onClick={eraseAll}>
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Barcode Scanner Modal ── */}
      {showBarcodeScanner && (
        <div className="modal-overlay">
          <div className="modal-card panel" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="flex-between" style={{ width: '100%', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Scan Barcode</h3>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => { stopBarcodeScanner(); setShowBarcodeScanner(false); }}>close</span>
            </div>
            
            {scannerError && (
              <div style={{ width: '100%', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#f87171' }}>
                {scannerError}
              </div>
            )}

            <div className="camera-container" style={{ width: '100%', height: '240px', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
              <div id="barcode-reader" style={{ width: '100%', height: '100%' }}></div>
              {!isScanningBarcode && !scannerError && (
                <div className="ai-overlay">
                  <button className="primary-btn" onClick={startBarcodeScanner}>Start Camera</button>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Place the barcode inside the camera frame. Works best with EAN-13 / UPC barcodes.
            </p>
          </div>
        </div>
      )}

      {/* ── Progress Picture Camera Modal ── */}
      {showProgressCamera && (
        <div className="modal-overlay">
          <div className="modal-card panel" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Take Progress Photo</h3>
              <span className="material-icons" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                onClick={() => setShowProgressCamera(false)}>close</span>
            </div>

            {progressCameraError && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#f87171' }}>
                {progressCameraError}
              </div>
            )}

            <div className="camera-container" style={{ width: '100%', height: '300px', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
              <video ref={progressVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: progressCameraStream ? 'block' : 'none', transform: progressFacingMode === 'user' ? 'scaleX(-1)' : 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="secondary-btn" onClick={toggleProgressFacingMode} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <span className="material-icons">flip_camera_ios</span> Flip
              </button>
              <button type="button" className="primary-btn" onClick={captureProgressPhoto} disabled={!progressCameraStream} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <span className="material-icons">photo_camera</span> Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Zoomed Image Modal ── */}
      {zoomedImage && (
        <div className="modal-overlay" onClick={() => setZoomedImage(null)} style={{ cursor: 'pointer', zIndex: 2000 }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <img src={zoomedImage} alt="Zoomed progress" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', display: 'block' }} />
            <button className="secondary-btn" onClick={() => setZoomedImage(null)} style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.4rem', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons">close</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
