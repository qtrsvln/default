import React, { useState } from 'react';
import { KitchenProduct, RecipePreferences } from '../types';
import { Clock, Heart, Sparkles, Check, ArrowLeft } from 'lucide-react';

interface CreateRecipeViewProps {
  products: KitchenProduct[];
  onBackToKitchen: () => void;
  onSubmitPreferences: (preferences: RecipePreferences) => void;
}

export const CreateRecipeView: React.FC<CreateRecipeViewProps> = ({
  products,
  onBackToKitchen,
  onSubmitPreferences,
}) => {
  const [selectedTime, setSelectedTime] = useState<'15 min' | '30 min' | '45+ min'>('30 min');
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['Quick & easy', 'Comfort food']);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['No preference']);

  const toggleMood = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      if (selectedMoods.length > 1) {
        setSelectedMoods(selectedMoods.filter((m) => m !== mood));
      }
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const toggleDiet = (diet: string) => {
    if (diet === 'No preference') {
      setSelectedDiets(['No preference']);
      return;
    }

    const withoutNoPref = selectedDiets.filter((d) => d !== 'No preference');
    if (withoutNoPref.includes(diet)) {
      const next = withoutNoPref.filter((d) => d !== diet);
      setSelectedDiets(next.length === 0 ? ['No preference'] : next);
    } else {
      setSelectedDiets([...withoutNoPref, diet]);
    }
  };

  const handleCreate = () => {
    onSubmitPreferences({
      time: selectedTime,
      moods: selectedMoods,
      diets: selectedDiets,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] p-6 text-[#1A2D23]">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div id="breadcrumbs" aria-label="Breadcrumbs" className="flex items-center gap-2 text-sm text-[#526B5D]">
          <button
            type="button"
            onClick={onBackToKitchen}
            className="inline-flex items-center gap-1.5 font-medium text-[#486153] hover:text-[#162E22] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kitchen</span>
          </button>
          <span className="text-[#A5B5AB] select-none">/</span>
          <span className="font-semibold text-[#162E22]">Craft recipe base</span>
        </div>

        {/* Header */}
        <div className="text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#162E22]">
            Craft your recipe base
          </h1>
          <p className="text-sm sm:text-base text-[#576D60]">
            We'll craft custom recipe recommendations using the ingredients available
            in your fridge and pantry.
          </p>
        </div>

        {/* Preferences Form Container */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D7] shadow-2xs space-y-6 text-left">
          {/* Available Products Key-Value */}
          <div
            id="available-ingredients-card"
            className="pb-6 border-b border-[#F0EAE0]"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 text-sm">
              <span className="font-bold text-[#162E22] shrink-0">
                Available products:
              </span>
              {products.length === 0 ? (
                <span className="text-[#889C8F] italic">
                  No products currently in your kitchen.
                </span>
              ) : (
                <span className="text-[#324B3C] leading-relaxed">
                  {products.slice(0, 10).map((p) => p.name).join(', ')}
                  {products.length > 10 && (
                    <span className="relative group inline-block ml-1.5 align-baseline">
                      <span
                        tabIndex={0}
                        aria-label={`${products.length - 10} more products`}
                        className="cursor-pointer font-bold text-[#162E22] hover:text-[#1B3B2B] transition-colors"
                      >
                        +{products.length - 10}
                      </span>
                      {/* Tooltip with white background and product names */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 hidden group-hover:flex group-focus:flex flex-col z-30 w-60 p-3 bg-white text-xs rounded-xl shadow-lg border border-[#E3DACB] pointer-events-none transition-all">
                        <span className="text-[#2D4537] leading-relaxed font-normal">
                          {products.slice(10).map((p) => p.name).join(', ')}
                        </span>
                        {/* Tooltip arrow */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#E3DACB] rotate-45" />
                      </div>
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* 1. TIME PREFERENCE */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#63796D] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1B3B2B]" />
              <span>TIME</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['15 min', '30 min', '45+ min'] as const).map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-3 rounded-2xl border-2 text-sm font-medium transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#1B3B2B] bg-[#EAF2ED] text-[#1B3B2B] font-semibold'
                        : 'border-[#E4DCCE] bg-[#FAF8F5] text-[#3D5245] hover:border-[#1B3B2B]/40 hover:bg-[#F4EFE7]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>{time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. DIET PREFERENCE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#63796D] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1B3B2B]" />
                <span>DIET</span>
              </label>
              <span className="text-[11px] text-[#7A9084]">Dietary filters</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['No preference', 'Vegetarian', 'Vegan', 'Gluten-free'].map((diet) => {
                const isSelected = selectedDiets.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDiet(diet)}
                    className={`py-3 px-3 rounded-2xl border-2 text-sm font-medium transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#1B3B2B] bg-[#EAF2ED] text-[#1B3B2B] font-semibold'
                        : 'border-[#E4DCCE] bg-[#FAF8F5] text-[#3D5245] hover:border-[#1B3B2B]/40 hover:bg-[#F4EFE7]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>{diet}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. MOOD PREFERENCE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#63796D] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#1B3B2B]" />
                <span>MOOD</span>
              </label>
              <span className="text-[11px] text-[#7A9084]">Select one or more</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Quick & easy', 'Comfort food', 'Healthy', 'Experimental'].map((mood) => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => toggleMood(mood)}
                    className={`py-3 px-3 rounded-2xl border-2 text-sm font-medium transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'border-[#1B3B2B] bg-[#EAF2ED] text-[#1B3B2B] font-semibold'
                        : 'border-[#E4DCCE] bg-[#FAF8F5] text-[#3D5245] hover:border-[#1B3B2B]/40 hover:bg-[#F4EFE7]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span>{mood}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA: "Create my recipe ✨" */}
          <div className="pt-4">
            <button
              id="create-my-recipe-submit-btn"
              type="button"
              onClick={handleCreate}
              className="w-full py-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#142C20] text-[#FAF7F2] font-semibold text-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Create my recipe</span>
              <span className="text-xl">✨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
