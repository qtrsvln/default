import React, { useState } from 'react';
import { Recipe } from '../types';
import { Refrigerator, X, Heart } from 'lucide-react';
import { WatchDownloadingPlaceholder } from './WatchDownloadingPlaceholder';

interface RecipeFinishedModalProps {
  recipe: Recipe;
  onAddToFridge: (isLiked?: boolean) => void;
  onDone: () => void;
}

export const RecipeFinishedModal: React.FC<RecipeFinishedModalProps> = ({
  recipe,
  onAddToFridge,
  onDone,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-completed-title"
      className="fixed inset-0 z-50 bg-[#162E22]/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-2xl animate-in zoom-in-95 duration-200 text-center space-y-6">
        {/* Dismiss / Close Icon */}
        <button
          type="button"
          onClick={onDone}
          title="Close"
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EAE2D5] text-[#526B5D] hover:text-[#162E22] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dish image / placeholder */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#1B3B2B]/20 shadow-md bg-[#18261F]">
          {recipe.image && !imgFailed ? (
            <>
              <img
                src={recipe.image}
                alt={recipe.name}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1B3B2B]/10" />
            </>
          ) : (
            <WatchDownloadingPlaceholder
              size="compact"
              recipeName={recipe.name}
            />
          )}
        </div>

        {/* Recipe title */}
        <div className="space-y-1.5 pt-1">
          <h2
            id="recipe-completed-title"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#162E22]"
          >
            Dinner is ready! 🎉
          </h2>
          <p className="text-base font-semibold text-[#2D5640]">
            {recipe.name}
          </p>
        </div>

        {/* Action Buttons: "Add to the fridge" and Like Heart icon */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-3">
            <button
              id="finished-add-to-fridge-primary-btn"
              type="button"
              onClick={() => onAddToFridge(isLiked)}
              className="flex-1 py-3.5 sm:py-4 px-4 rounded-2xl bg-[#1B3B2B] hover:bg-[#142C20] text-[#FAF7F2] font-semibold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Refrigerator className="w-5 h-5" />
              <span>Add to the fridge</span>
            </button>

            <button
              id="finished-toggle-like-btn"
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
              title={isLiked ? 'Unlike recipe' : 'Save to favorites'}
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0 ${
                isLiked
                  ? 'bg-[#FDECE9] border-[#F6C6BF] text-[#E53935]'
                  : 'bg-[#FAF8F4] border-[#D9D0C1] text-[#7B9284] hover:text-[#E53935] hover:border-[#E53935]/40 hover:bg-[#FAF7F2]'
              }`}
            >
              <Heart
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                  isLiked ? 'fill-current scale-110' : ''
                }`}
              />
            </button>
          </div>

          <button
            id="finished-done-secondary-btn"
            type="button"
            onClick={onDone}
            className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#576F61] hover:text-[#162E22] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

