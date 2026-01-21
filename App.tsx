import React, { useState, useEffect } from 'react';
import { LOCATIONS } from './data';
import { GameState, GameStats } from './types';
import { Check, X, MapPin, AlertTriangle, Play, RefreshCw, Trophy } from 'lucide-react';
import { Features } from './components/Features';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [stats, setStats] = useState<GameStats>({ score: 0, correctDecisions: 0, totalDecisions: 0 });
  const [failReason, setFailReason] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const currentLocation = LOCATIONS[currentIndex];
  const progress = ((currentIndex) / LOCATIONS.length) * 100;

  const startGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setStats({ score: 0, correctDecisions: 0, totalDecisions: 0 });
    setFailReason('');
    setFeedback(null);
  };

  const handleDecision = (approved: boolean) => {
    const isActuallyGood = currentLocation.isGood;
    let isWin = false;
    let isLoss = false;
    let currentFeedback = '';

    if (approved) {
      if (isActuallyGood) {
        // Correct Approval
        setStats(prev => ({ 
          ...prev, 
          score: prev.score + 100, 
          correctDecisions: prev.correctDecisions + 1,
          totalDecisions: prev.totalDecisions + 1
        }));
        currentFeedback = "Отлично! Хорошая локация одобрена.";
        showFeedback(currentFeedback, 'success');
      } else {
        // Critical Error: Approved a bad location
        isLoss = true;
        setFailReason(currentLocation.stopFactorReason || "Вы одобрили локацию с критическим недостатком.");
      }
    } else {
      if (!isActuallyGood) {
        // Correct Rejection
        setStats(prev => ({ 
          ...prev, 
          score: prev.score + 50, 
          correctDecisions: prev.correctDecisions + 1,
          totalDecisions: prev.totalDecisions + 1
        }));
        currentFeedback = "Правильно! Мы избежали проблемной точки.";
        showFeedback(currentFeedback, 'success');
      } else {
        // Missed Opportunity: Rejected a good location
        // We don't fail, but we don't get points.
        setStats(prev => ({
          ...prev,
          totalDecisions: prev.totalDecisions + 1
        }));
        currentFeedback = "Упс! Это было хорошее место. Мы упустили выгоду.";
        showFeedback(currentFeedback, 'warning');
      }
    }

    if (isLoss) {
      setTimeout(() => setGameState('lost'), 500);
    } else {
      setTimeout(() => {
        if (currentIndex < LOCATIONS.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setGameState('won');
        }
      }, 1500); // Wait for feedback reading
    }
  };

  const showFeedback = (msg: string, type: 'success' | 'warning') => {
    setFeedback({ message: msg, type });
    setTimeout(() => setFeedback(null), 1500);
  };

  // --- Intro Screen ---
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={40} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Менеджер Развития</h1>
          <p className="text-gray-500 mb-8">
            Твоя задача — открыть 5 успешных ПВЗ "Магнит Маркет".
            Внимательно изучай локации. Одна ошибка с критическим стоп-фактором приведет к увольнению!
          </p>
          <button 
            onClick={startGame}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <Play size={20} />
            Начать смену
          </button>
        </div>
      </div>
    );
  }

  // --- Game Over Screen (Loss) ---
  if (gameState === 'lost') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-t-8 border-red-600">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Ошибка согласования!</h2>
          <p className="text-red-600 font-medium text-center mb-6">
            Вы одобрили непригодную локацию.
          </p>
          <div className="bg-red-50 p-4 rounded-lg mb-8 border border-red-100">
            <p className="text-gray-800 text-sm leading-relaxed">
              <span className="font-bold">Причина отказа:</span> {failReason}
            </p>
          </div>
          <button 
            onClick={startGame}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw size={18} />
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // --- Win Screen ---
  if (gameState === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Trophy size={48} className="text-yellow-600" />
            <div className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
              {stats.score}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Отличная работа!</h2>
          <p className="text-gray-500 mb-6">
            Вы рассмотрели все заявки.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Баллы</p>
              <p className="text-2xl font-bold text-gray-900">{stats.score}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Точность</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((stats.correctDecisions / stats.totalDecisions) * 100)}%
              </p>
            </div>
          </div>

          <button 
            onClick={startGame}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <RefreshCw size={20} />
            Новая игра
          </button>
        </div>
      </div>
    );
  }

  // --- Main Gameplay Interface ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Header / Progress */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">MM</div>
            <div>
                <h3 className="text-sm font-bold text-gray-900">Магнит Маркет</h3>
                <p className="text-xs text-gray-500">Симулятор развития</p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <div className="text-sm font-semibold text-gray-700 mb-1">
                Локация {currentIndex + 1} из {LOCATIONS.length}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-red-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px] relative">
        
        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`
              px-8 py-6 rounded-2xl shadow-2xl transform scale-110
              ${feedback.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-500' : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500'}
            `}>
              <div className="flex flex-col items-center gap-2">
                {feedback.type === 'success' ? <Check size={48} /> : <AlertTriangle size={48} />}
                <p className="text-xl font-bold text-center">{feedback.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Left Side: Image & Visuals */}
        <div className="md:w-1/2 bg-gray-100 relative group h-64 md:h-auto">
            <img 
                src={currentLocation.imageUrl} 
                alt={currentLocation.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-start gap-2 text-white">
                    <MapPin className="shrink-0 mt-1 text-red-400" size={18} />
                    <div>
                        <h2 className="text-xl font-bold leading-tight mb-1">{currentLocation.title}</h2>
                        <p className="text-gray-300 text-sm">{currentLocation.address}</p>
                    </div>
                </div>
            </div>
            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                 ID: #{currentLocation.id}
            </div>
        </div>

        {/* Right Side: Data & Controls */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            
            <Features location={currentLocation} />

            <div className="mb-6">
                <h4 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-2">Описание объекта</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {currentLocation.description}
                </p>

                <h4 className="text-sm uppercase tracking-wide text-gray-400 font-bold mb-2">Особенности</h4>
                <div className="flex flex-wrap gap-2">
                    {currentLocation.features.map((feat, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                            {feat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleDecision(false)}
                    disabled={!!feedback}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-500 hover:text-gray-800 disabled:opacity-50"
                >
                    <X size={28} className="mb-1" />
                    <span className="font-bold text-sm">Отклонить</span>
                </button>
                
                <button
                    onClick={() => handleDecision(true)}
                    disabled={!!feedback}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all transform active:scale-95 disabled:opacity-50"
                >
                    <Check size={28} className="mb-1" />
                    <span className="font-bold text-sm">Одобрить</span>
                </button>
            </div>
        </div>
      </div>

      <div className="mt-6 text-gray-400 text-xs text-center max-w-md">
         Внимательно изучайте площадь, этажность и окружение. <br/>Не все объекты подходят под стандарты Магнит Маркет.
      </div>

    </div>
  );
}