import { useState, useEffect, useMemo } from 'react';
import { Activity, Calculator, Info, Target, User, Calendar, Flame, Scale, Utensils, Zap, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Gender, ActivityLevel, WeightLossIntensity, UserMetrics, CalculationResults, WeeklyExerciseHours } from './types';

export default function App() {
  const [metrics, setMetrics] = useState<UserMetrics>({
    gender: Gender.MALE,
    age: 25,
    height: 175,
    weight: 75,
    targetWeight: 70,
    activityLevel: ActivityLevel.SEDENTARY,
    intensity: WeightLossIntensity.NORMAL,
    weeklyExerciseHours: WeeklyExerciseHours.FOUR_FIVE,
  });

  const [weightUnit, setWeightUnit] = useState<'kg' | 'jin'>('kg');
  const [targetWeightUnit, setTargetWeightUnit] = useState<'kg' | 'jin'>('kg');

  const results = useMemo<CalculationResults>(() => {
    const { weight, height, age, gender, activityLevel, targetWeight, intensity, weeklyExerciseHours } = metrics;
    
    // BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // BFP (BMI Method)
    const bfp = gender === Gender.MALE 
      ? (1.20 * bmi) + (0.23 * age) - 16.2 
      : (1.20 * bmi) + (0.23 * age) - 5.4;

    // BMR (Mifflin-St Jeor)
    const bmr = gender === Gender.MALE
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const tdee = bmr * activityLevel;
    const weightToLose = Math.max(0, weight - targetWeight);
    const totalKcalDeficit = weightToLose * 7700;
    const daysNeeded = weightToLose > 0 ? Math.ceil(totalKcalDeficit / intensity) : 0;
    const recommendedIntake = tdee - intensity;

    // Macro Calculations
    let carbRatio = 2.2;
    let proteinRatio = 1.4;
    let fatRatio = 0.8;

    switch (weeklyExerciseHours) {
      case WeeklyExerciseHours.TWO_THREE:
        carbRatio = 2.2; proteinRatio = 1.4; fatRatio = 0.8;
        break;
      case WeeklyExerciseHours.FOUR_FIVE:
        carbRatio = 2.5; proteinRatio = 1.5; fatRatio = 0.95;
        break;
      case WeeklyExerciseHours.SIX_SEVEN:
        carbRatio = 3.0; proteinRatio = 1.6; fatRatio = 1.1;
        break;
      case WeeklyExerciseHours.EIGHT_NINE:
      case WeeklyExerciseHours.TEN_PLUS:
        carbRatio = 3.5; proteinRatio = 1.8; fatRatio = 1.1;
        break;
    }

    const carbs = weight * carbRatio;
    const protein = weight * proteinRatio;
    const fat = weight * fatRatio;
    const totalKcal = (carbs * 4) + (protein * 4) + (fat * 9);

    return {
      bmi,
      bfp,
      bmr,
      tdee,
      weightToLose,
      totalKcalDeficit,
      daysNeeded,
      recommendedIntake,
      macros: { carbs, protein, fat, totalKcal }
    };
  }, [metrics]);

  const handleWeightChange = (val: string, type: 'current' | 'target', unit: 'kg' | 'jin') => {
    const num = parseFloat(val) || 0;
    const kgValue = unit === 'jin' ? num / 2 : num;
    
    if (type === 'current') {
      setMetrics(prev => ({ ...prev, weight: kgValue }));
    } else {
      setMetrics(prev => ({ ...prev, targetWeight: kgValue }));
    }
  };

  const displayWeight = weightUnit === 'kg' ? metrics.weight : metrics.weight * 2;
  const displayTargetWeight = targetWeightUnit === 'kg' ? metrics.targetWeight : metrics.targetWeight * 2;

  // Diet Scaling (Baseline 85kg)
  const scale = metrics.weight / 85;
  const dietExample = {
    breakfast: [
      { name: '鸡蛋', amount: Math.round(2), unit: '个' },
      { name: '燕麦片/全麦面包', amount: Math.round(50 * scale), unit: 'g' },
      { name: '牛奶/豆浆', amount: 250, unit: 'ml' },
    ],
    lunch: [
      { name: '瘦肉(鸡胸/牛肉)', amount: Math.round(150 * scale), unit: 'g' },
      { name: '大米(生重)', amount: Math.round(93 * scale), unit: 'g' },
      { name: '绿叶蔬菜', amount: 250, unit: 'g' },
    ],
    dinner: [
      { name: '鱼肉/虾仁', amount: Math.round(150 * scale), unit: 'g' },
      { name: '红薯/紫薯', amount: Math.round(120 * scale), unit: 'g' },
      { name: '时令蔬菜', amount: 200, unit: 'g' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-7xl font-serif italic font-black tracking-tighter text-gray-900">
              临也物语
            </h1>
            <div className="flex items-center justify-center gap-4 text-blue-600 font-bold tracking-[0.3em] uppercase text-xs">
              <div className="h-[1px] w-12 bg-blue-600/20" />
              减脂计算器
              <div className="h-[1px] w-12 bg-blue-600/20" />
            </div>
          </motion.div>
          <div className="mt-6 flex justify-center">
            <div className="px-3 py-1 bg-gray-900 text-white text-[10px] font-mono uppercase tracking-widest rounded-sm">
              Science-Based Nutrition Planning
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit"
          >
            <div className="flex items-center gap-3 mb-6 text-2xl font-serif italic font-bold border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-blue-500" />
              个人基本信息
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">性别</label>
              <div className="flex gap-4">
                {[Gender.MALE, Gender.FEMALE].map((g) => (
                  <button
                    key={g}
                    onClick={() => setMetrics(prev => ({ ...prev, gender: g }))}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      metrics.gender === g 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {g === Gender.MALE ? '男' : '女'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">年龄 (岁)</label>
                <input
                  type="number"
                  value={metrics.age}
                  onChange={(e) => setMetrics(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">身高 (cm)</label>
                <input
                  type="number"
                  value={metrics.height}
                  onChange={(e) => setMetrics(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Current Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">当前体重</label>
                <div className="flex bg-gray-100 p-1 rounded-md text-xs">
                  <button 
                    onClick={() => setWeightUnit('kg')}
                    className={`px-2 py-0.5 rounded ${weightUnit === 'kg' ? 'bg-white shadow-sm' : ''}`}
                  >kg</button>
                  <button 
                    onClick={() => setWeightUnit('jin')}
                    className={`px-2 py-0.5 rounded ${weightUnit === 'jin' ? 'bg-white shadow-sm' : ''}`}
                  >斤</button>
                </div>
              </div>
              <input
                type="number"
                value={displayWeight || ''}
                onChange={(e) => handleWeightChange(e.target.value, 'current', weightUnit)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Target Weight */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Target className="w-4 h-4 text-red-500" /> 目标体重
                </label>
                <div className="flex bg-gray-100 p-1 rounded-md text-xs">
                  <button 
                    onClick={() => setTargetWeightUnit('kg')}
                    className={`px-2 py-0.5 rounded ${targetWeightUnit === 'kg' ? 'bg-white shadow-sm' : ''}`}
                  >kg</button>
                  <button 
                    onClick={() => setTargetWeightUnit('jin')}
                    className={`px-2 py-0.5 rounded ${targetWeightUnit === 'jin' ? 'bg-white shadow-sm' : ''}`}
                  >斤</button>
                </div>
              </div>
              <input
                type="number"
                value={displayTargetWeight || ''}
                onChange={(e) => handleWeightChange(e.target.value, 'target', targetWeightUnit)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" /> 日常活动量 (TDEE系数)
              </label>
              <select
                value={metrics.activityLevel}
                onChange={(e) => setMetrics(prev => ({ ...prev, activityLevel: parseFloat(e.target.value) }))}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value={ActivityLevel.SEDENTARY}>久坐 (办公室工作，极少运动)</option>
                <option value={ActivityLevel.LIGHTLY_ACTIVE}>轻度 (每周运动1-3天)</option>
                <option value={ActivityLevel.MODERATELY_ACTIVE}>中度 (每周运动3-5天)</option>
                <option value={ActivityLevel.VERY_ACTIVE}>高度 (每周运动6-7天)</option>
                <option value={ActivityLevel.EXTRA_ACTIVE}>极高 (体力劳动或专业运动员)</option>
              </select>
            </div>

            {/* Weekly Exercise Hours */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="w-4 h-4 text-indigo-500" /> 每周运动时长 (用于饮食建议)
              </label>
              <select
                value={metrics.weeklyExerciseHours}
                onChange={(e) => setMetrics(prev => ({ ...prev, weeklyExerciseHours: e.target.value as WeeklyExerciseHours }))}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value={WeeklyExerciseHours.TWO_THREE}>每周 2-3 小时</option>
                <option value={WeeklyExerciseHours.FOUR_FIVE}>每周 4-5 小时</option>
                <option value={WeeklyExerciseHours.SIX_SEVEN}>每周 6-7 小时</option>
                <option value={WeeklyExerciseHours.EIGHT_NINE}>每周 8-9 小时</option>
                <option value={WeeklyExerciseHours.TEN_PLUS}>每周 10 小时以上</option>
              </select>
            </div>

            {/* Intensity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" /> 减脂强度 (每日热量缺口)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '温和', val: WeightLossIntensity.MILD, desc: '300kcal' },
                  { label: '正常', val: WeightLossIntensity.NORMAL, desc: '500kcal' },
                  { label: '激进', val: WeightLossIntensity.AGGRESSIVE, desc: '800kcal' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setMetrics(prev => ({ ...prev, intensity: item.val }))}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      metrics.intensity === item.val 
                        ? 'bg-orange-50 border-orange-500 text-orange-700' 
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-70">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Primary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <Scale className="w-4 h-4" /> 估算体脂率
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {results.bfp.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  BMI: {results.bmi.toFixed(1)}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                  <Flame className="w-4 h-4" /> 基础代谢 (BMR)
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round(results.bmr)} <span className="text-sm font-normal text-gray-400">kcal/天</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  维持生命所需的最低热量
                </div>
              </div>
            </div>

            {/* TDEE & Recommendation */}
            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-blue-100 text-sm uppercase tracking-wider font-semibold">每日总消耗 (TDEE)</div>
                    <div className="text-5xl font-black mt-1">{Math.round(results.tdee)}</div>
                    <div className="text-blue-200 text-sm mt-1">kcal / 每天</div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                    <Activity className="w-8 h-8" />
                  </div>
                </div>
                <div className="h-px bg-white/20 my-6" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">建议每日摄入热量</span>
                    <span className="text-2xl font-bold">{Math.round(results.recommendedIntake)} kcal</span>
                  </div>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    按照当前的活动量，如果您每天摄入约 {Math.round(results.recommendedIntake)} 大卡，
                    将产生每日 {metrics.intensity} 大卡的热量缺口。
                  </p>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
            </div>

            {/* Goal Prediction */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8 text-2xl font-serif italic font-bold border-b border-gray-100 pb-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                目标达成推断
              </div>
              
              {results.weightToLose > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">需要减掉</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {results.weightToLose.toFixed(1)} <span className="text-sm font-normal">kg</span>
                    </div>
                    <div className="text-[10px] text-gray-400">({(results.weightToLose * 2).toFixed(1)} 斤)</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">总热量缺口</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {results.totalKcalDeficit.toLocaleString()} <span className="text-sm font-normal">kcal</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="text-purple-600 text-xs mb-1 font-semibold uppercase">预计耗时</div>
                    <div className="text-3xl font-black text-purple-700">
                      {results.daysNeeded} <span className="text-sm font-normal">天</span>
                    </div>
                    <div className="text-[10px] text-purple-400 mt-1">
                      约 {(results.daysNeeded / 30).toFixed(1)} 个月
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>您已达到或低于目标体重！</p>
                </div>
              )}
            </div>

            {/* Diet & Carbon Cycling Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-10">
              <div className="flex items-center gap-3 text-2xl font-serif italic font-bold border-b border-gray-100 pb-3">
                <Utensils className="w-5 h-5 text-orange-500" />
                减脂饮食计划 & 碳循环建议
              </div>

              {/* Macros - Full Width on Mobile, Grid on PC */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-1 h-4 bg-orange-500 rounded-full" />
                  每日推荐宏量营养素摄入
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="text-orange-600 text-xs mb-1">碳水化合物</div>
                    <div className="text-xl font-bold">{Math.round(results.macros.carbs)}g</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-blue-600 text-xs mb-1">蛋白质</div>
                    <div className="text-xl font-bold">{Math.round(results.macros.protein)}g</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="text-green-600 text-xs mb-1">脂肪</div>
                    <div className="text-xl font-bold">{Math.round(results.macros.fat)}g</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                  <span>宏量总热量: {Math.round(results.macros.totalKcal)} kcal</span>
                  <span className={results.macros.totalKcal < results.tdee ? "text-green-600 font-medium" : "text-red-500"}>
                    {results.macros.totalKcal < results.tdee ? `低于 TDEE (${Math.round(results.tdee - results.macros.totalKcal)} kcal 缺口)` : "高于 TDEE (建议增加运动或减少摄入)"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Sample Diet */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    示例饮食结构 (基于体重缩放)
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: '早餐', items: dietExample.breakfast, color: 'bg-yellow-50 border-yellow-100' },
                      { title: '午餐', items: dietExample.lunch, color: 'bg-green-50 border-green-100' },
                      { title: '晚餐', items: dietExample.dinner, color: 'bg-indigo-50 border-indigo-100' },
                    ].map((meal) => (
                      <div key={meal.title} className={`${meal.color} p-4 rounded-xl border`}>
                        <div className="font-bold text-sm mb-2">{meal.title}</div>
                        <ul className="text-xs space-y-1 text-gray-600">
                          {meal.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="font-medium">{item.amount}{item.unit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 italic">
                    * 示例仅供参考，可根据宏量目标灵活替换同类食物。
                  </p>
                </div>

                {/* Carbon Cycling */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-500 rounded-full" />
                    碳循环 (Carb Cycling) 建议
                  </h3>
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 space-y-4 h-full">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-purple-900 mb-1">什么是碳循环？</div>
                        <p className="text-xs text-purple-800 leading-relaxed">
                          碳循环是通过在不同日子调整碳水化合物摄入量，来优化减脂和维持代谢的方法。
                          通常在训练日摄入较高碳水以支持运动表现，在休息日降低碳水以加速脂肪氧化。
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="text-xs font-bold text-purple-700 mb-1 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" /> 高碳日 (训练日)
                        </div>
                        <div className="text-[10px] text-gray-600">
                          摄入 100% 推荐碳水 ({Math.round(results.macros.carbs)}g)。
                          集中在训练前后摄入，为肌肉提供能量。
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-200">
                        <div className="text-xs font-bold text-purple-700 mb-1 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" /> 低碳日 (休息日)
                        </div>
                        <div className="text-[10px] text-gray-600">
                          摄入 50% 推荐碳水 ({Math.round(results.macros.carbs * 0.5)}g)。
                          增加蔬菜和健康脂肪摄入，提高饱腹感。
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-purple-600 font-medium pt-2 border-t border-purple-200">
                      建议安排：您的运动频率为{metrics.weeklyExerciseHours}小时/周，建议每周安排 3-4 天高碳日（对应高强度训练），其余为低碳日。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reference Section */}
        <section className="mt-20 bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8 text-2xl font-serif italic font-bold border-b border-gray-100 pb-4">
            <Info className="w-6 h-6 text-blue-500" />
            计算公式与参考说明
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-l-4 border-blue-500 pl-3">核心计算公式</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <span className="font-semibold text-gray-800">BMR (Mifflin-St Jeor):</span><br/>
                  男: 10×体重 + 6.25×身高 - 5×年龄 + 5<br/>
                  女: 10×体重 + 6.25×身高 - 5×年龄 - 161
                </li>
                <li>
                  <span className="font-semibold text-gray-800">体脂率 (BMI估算法):</span><br/>
                  男: (1.20 × BMI) + (0.23 × 年龄) - 16.2<br/>
                  女: (1.20 × BMI) + (0.23 × 年龄) - 5.4
                </li>
                <li>
                  <span className="font-semibold text-gray-800">宏量营养素 (基于运动量):</span><br/>
                  碳水: 2.2~3.5g/kg | 蛋白: 1.4~1.8g/kg | 脂肪: 0.8~1.2g/kg
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-700 border-l-4 border-green-500 pl-3">活动系数参考 (PAL)</h3>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 border">活动程度</th>
                    <th className="p-2 border">系数</th>
                    <th className="p-2 border">描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border">久坐</td><td className="p-2 border">1.2</td><td className="p-2 border">办公室工作，极少运动</td></tr>
                  <tr><td className="p-2 border">轻度</td><td className="p-2 border">1.375</td><td className="p-2 border">每周1-3天轻量运动</td></tr>
                  <tr><td className="p-2 border">中度</td><td className="p-2 border">1.55</td><td className="p-2 border">每周3-5天中等强度运动</td></tr>
                  <tr><td className="p-2 border">高度</td><td className="p-2 border">1.725</td><td className="p-2 border">每周6-7天高强度运动</td></tr>
                </tbody>
              </table>
              <p className="text-[10px] text-gray-400 italic mt-2">
                * 注：计算结果仅供参考。实际减脂受代谢水平、睡眠、激素等多种因素影响。建议在医生或专业教练指导下进行。
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] pb-12">
          &copy; 2026 临也物语 · IZAYA MONOGATARI · 科学减脂
        </footer>
      </div>
    </div>
  );
}
