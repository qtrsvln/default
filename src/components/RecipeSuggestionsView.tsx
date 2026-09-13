import React, { useEffect, useState } from 'react';
import { Recipe, RecipePreferences, KitchenProduct, CookedDish } from '../types';
import { ALL_RECIPES } from '../data/mockData';
import { Clock, ChefHat, ArrowLeft, ArrowRight, Sparkles, Heart, Flame } from 'lucide-react';
import { WatchDownloadingPlaceholder } from './WatchDownloadingPlaceholder';

interface RecipeSuggestionsViewProps {
  products: KitchenProduct[];
  cookedDishes: CookedDish[];
  preferences: RecipePreferences;
  onSelectRecipe: (recipe: Recipe) => void;
  onQuickMarkCooked?: (recipe: Recipe) => void;
  onBackToPreferences: () => void;
}

export const RecipeSuggestionsView: React.FC<RecipeSuggestionsViewProps> = ({
  products,
  cookedDishes,
  preferences,
  onSelectRecipe,
  onQuickMarkCooked,
  onBackToPreferences,
}) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<{
    recipe: Recipe;
    haveIngredients: string[];
    needIngredients: string[];
  }[]>([]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [likedRecipes, setLikedRecipes] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    cookedDishes.forEach((d) => {
      if (d.isLiked) {
        initial[d.id] = true;
      }
    });
    return initial;
  });

  const toggleLike = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    setLikedRecipes((prev) => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Avoid dishes that already exist in Cooked dishes when possible
      const cookedDishNames = new Set(
        cookedDishes.map((d) => d.name.toLowerCase().trim())
      );

      // Normalized product names list from user's kitchen
      const userIngredientNames = products.map((p) => p.name.toLowerCase().trim());

      // Filter and score recipes
      const scored = ALL_RECIPES.map((recipe) => {
        const isAlreadyCooked = cookedDishNames.has(recipe.name.toLowerCase().trim());

        const have: string[] = [];
        const need: string[] = [];

        recipe.ingredients.forEach((ing) => {
          const ingLower = ing.name.toLowerCase();
          // Check if any product in user's kitchen matches this ingredient
          const matched = userIngredientNames.some(
            (p) => ingLower.includes(p) || p.includes(ingLower)
          );
          if (matched) {
            have.push(ing.name);
          } else {
            need.push(ing.name);
          }
        });

        // Match preferences
        let matchScore = have.length * 2;
        if (isAlreadyCooked) matchScore -= 10;
        if (recipe.timeCategory === preferences.time) matchScore += 3;
        if (recipe.moodTags.some((m) => preferences.moods.includes(m))) matchScore += 2;
        if (
          preferences.diets.length > 0 &&
          !preferences.diets.includes('No preference') &&
          recipe.dietTags.some((d) => preferences.diets.includes(d))
        ) {
          matchScore += 4;
        }

        return {
          recipe,
          haveIngredients: have,
          needIngredients: need,
          score: matchScore,
          isAlreadyCooked,
        };
      });

      // Sort by best score, prioritize not cooked
      scored.sort((a, b) => b.score - a.score);

      // Take top 3 mock recipe suggestions
      const top3 = scored.slice(0, 3).map((item) => ({
        recipe: item.recipe,
        haveIngredients: item.haveIngredients,
        needIngredients: item.needIngredients,
      }));

      setSuggestions(top3);
      setLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, [products, cookedDishes, preferences]);

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-[#E8F0EA] border border-[#D0E2D4] flex items-center justify-center text-3xl animate-bounce">
            🍲
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B3B2B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#1B3B2B]"></span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#162E22]">
          Finding something delicious...
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#5C7164] max-w-sm">
          Matching your fridge and storage with {preferences.time} recipes tailored to your mood.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] py-8 sm:py-12 text-[#1A2D23]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top bar with Breadcrumbs */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
          <div id="breadcrumbs" className="flex items-center gap-2 text-sm text-[#526B5D]">
            <button
              type="button"
              onClick={onBackToPreferences}
              className="inline-flex items-center gap-1.5 font-medium text-[#486153] hover:text-[#162E22] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Craft recipe base</span>
            </button>
            <span className="text-[#A5B5AB] select-none">/</span>
            <span className="font-semibold text-[#162E22]">Recommendations</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-left space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#162E22]">
            Recommended for you
          </h1>
          <p className="text-sm sm:text-base text-[#5A6E62]">
            Selected based on what you have right now. Tap a recipe to inspect details or start cooking.
          </p>
        </div>

        {/* 3 Mock Recipe Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {suggestions.map(({ recipe }) => (
            <div
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRecipe(recipe);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View recipe for ${recipe.name}`}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D7] hover:border-[#204E35]/40 shadow-2xs hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between text-left group cursor-pointer active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1B3B2B]"
            >
              {/* Recipe Image & Meta */}
              <div>
                <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-[#18261F]">
                  {recipe.image && !failedImages[recipe.id] ? (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [recipe.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <WatchDownloadingPlaceholder
                      size="medium"
                      recipeName={recipe.name}
                    />
                  )}

                  {/* Like icon over picture */}
                  <button
                    type="button"
                    onClick={(e) => toggleLike(e, recipe.id)}
                    aria-label={likedRecipes[recipe.id] ? 'Unlike recipe' : 'Like recipe'}
                    className={`absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md ${
                      likedRecipes[recipe.id]
                        ? 'bg-white text-[#E53935] hover:scale-110'
                        : 'bg-black/40 hover:bg-black/60 text-white hover:text-[#FF7373] hover:scale-105'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        likedRecipes[recipe.id] ? 'fill-current scale-110' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#667B6E] mb-1">
                      <span>{recipe.prepTime}</span>
                      <span>·</span>
                      <span>{recipe.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#162E22] group-hover:text-[#214D35] transition-colors">
                      {recipe.name}
                    </h3>
                  </div>

                  {/* Energy value */}
                  <div className="pt-3 border-t border-[#F2ECE2] space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#162E22]">
                      <Flame className="w-4 h-4 text-[#E67E22] shrink-0" />
                      <span>Energy value:</span>
                      <span className="text-[#1B3B2B]">
                        {recipe.energy?.calories || recipe.calories || 450} kcal
                      </span>
                    </div>
                    {recipe.energy && (
                      <div className="flex items-center gap-2 text-[11px] text-[#637A6D]">
                        <span>
                          Protein: <strong className="font-semibold text-[#162E22]">{recipe.energy.protein}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Carbs: <strong className="font-semibold text-[#162E22]">{recipe.energy.carbs}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Fat: <strong className="font-semibold text-[#162E22]">{recipe.energy.fat}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
