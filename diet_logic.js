
const SEASON_CONFIG = {
    spring: {
        terms: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨'],
        color: 'green',
        organ: '肝',
        advice: '春季养肝，宜食青色蔬果，保持心情舒畅。'
    },
    summer: {
        terms: ['立夏', '小满', '芒种', '夏至', '小暑', '大暑'],
        color: 'red',
        organ: '心',
        advice: '夏季养心，宜食红色食物，注意防暑降温。'
    },
    autumn: {
        terms: ['立秋', '处暑', '白露', '秋分', '寒露', '霜降'],
        color: 'white',
        organ: '肺',
        advice: '秋季润肺，宜食白色食物，防燥护阴。'
    },
    winter: {
        terms: ['立冬', '小雪', '大雪', '冬至', '小寒', '大寒'],
        color: 'black',
        organ: '肾',
        advice: '冬季补肾，宜食黑色食物，藏精蓄锐。'
    },
    transition: {
        // Late summer or transition periods (often associated with Spleen/Yellow)
        // For simplicity, we can treat specific terms as transition if needed, 
        // or just map Spleen to general "digestive health" advice.
        color: 'yellow',
        organ: '脾',
        advice: '健脾益气，宜食黄色食物，调和脾胃。'
    }
};

class RecommendationEngine {
    constructor(recipeData) {
        this.recipes = recipeData;
    }

    // Get current Solar Term and Season info
    getSeasonInfo() {
        // Use Lunar library assuming it's loaded globally as 'Solar' and 'Lunar'
        // If not available, fallback to date based approximation
        try {
            const now = new Date();
            const solar = Solar.fromDate(now);
            const lunar = solar.getLunar();
            const jieQi = lunar.getJieQi(); // Current solar term if today is one
            const prevJieQi = lunar.getPrevJieQi(); // Previous solar term (current period)
            
            // Determine effective solar term (today's or the one we are in)
            const currentTerm = jieQi || prevJieQi.getName();
            
            // Get Festivals
            const festivals = lunar.getFestivals().map(f => f.toString());
            const otherFestivals = lunar.getOtherFestivals().map(f => f.toString());
            const allFestivals = [...festivals, ...otherFestivals].join(' · ');

            let seasonKey = 'spring'; // default
            for (const [key, config] of Object.entries(SEASON_CONFIG)) {
                if (config.terms.includes(currentTerm)) {
                    seasonKey = key;
                    break;
                }
            }
            
            return {
                term: currentTerm,
                season: seasonKey,
                config: SEASON_CONFIG[seasonKey],
                lunarStr: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
                festivals: allFestivals
            };
        } catch (e) {
            console.error("Calendar logic error:", e);
            return {
                term: '未知',
                season: 'spring',
                config: SEASON_CONFIG.spring,
                lunarStr: '',
                festivals: ''
            };
        }
    }

    // Check if recipe is "Light/Digestible"
    isLight(recipe) {
        const lightKeywords = ['蒸', '煮', '汤', '粥', '凉拌', '清炒', '白灼', '炖', '焯'];
        const heavyKeywords = ['炸', '红烧', '辣', '烤', '煎'];
        
        // Check name and steps
        const text = (recipe.name + recipe.steps.join('')).toLowerCase();
        
        // If explicit "light" tag exists (future proof)
        if (recipe.tags && recipe.tags.includes('light')) return true;

        const hasLight = lightKeywords.some(k => text.includes(k));
        const hasHeavy = heavyKeywords.some(k => text.includes(k));
        
        // Default to light if matches light keywords and doesn't have heavy keywords
        // Or if it's explicitly "Tofu", "Vegetable" dominant without heavy cooking
        return hasLight && !hasHeavy;
    }

    getRecommendations() {
        const info = this.getSeasonInfo();
        const seasonConfig = info.config;
        
        // 1. Filter by Season (Color/Organ)
        let seasonalRecipes = this.recipes.filter(r => {
            return r.colors.includes(seasonConfig.color) || r.organs.includes(seasonConfig.organ);
        });

        // 2. Check for Fast Day (Zhai Ri)
        // Assuming global helper or we check calendar
        let isFastDay = false;
        let fastDayInfo = '';
        try {
            const solar = Solar.fromDate(new Date());
            const lunar = solar.getLunar();
            // Simple check for common fast days (Six Fast Days)
            const day = lunar.getDay();
            const sixFastDays = [8, 14, 15, 23, 29, 30];
            // Handle small months for 28/29
            if (sixFastDays.includes(day)) {
                isFastDay = true;
                fastDayInfo = '六斋日';
            }
            // Add Ten Fast Days logic if needed, or rely on existing UI logic
        } catch(e) {}

        if (isFastDay) {
            // Prioritize light meals
            seasonalRecipes = seasonalRecipes.filter(r => this.isLight(r));
            // If filtering removed too many, fallback to all light meals
            if (seasonalRecipes.length < 5) {
                const allLight = this.recipes.filter(r => this.isLight(r));
                // Add more light meals to fill up
                const remaining = allLight.filter(r => !seasonalRecipes.includes(r));
                seasonalRecipes = [...seasonalRecipes, ...remaining];
            }
        }

        // 3. Randomize and Limit
        // Shuffle array
        const shuffled = seasonalRecipes.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(10, Math.max(5, shuffled.length)));
        
        // Mark them with badges
        const finalResults = selected.map(r => ({
            ...r,
            recommendationBadge: isFastDay ? '斋日推荐' : '时令推荐'
        }));

        return {
            recipes: finalResults,
            info: {
                lunarDate: info.lunarStr,
                term: info.term,
                advice: seasonConfig.advice,
                isFastDay: isFastDay,
                fastDayLabel: fastDayInfo,
                festivals: info.festivals
            }
        };
    }
}

// Global instance
let dietEngine = null;

function initDietEngine() {
    if (!dietEngine && window.recipeData) {
        dietEngine = new RecommendationEngine(window.recipeData);
    }
}

function renderDietPage() {
    initDietEngine();
    
    const container = document.getElementById('diet-container');
    if (!container) return;

    if (!dietEngine) {
        console.warn('DietEngine not initialized. Missing recipeData?');
        container.innerHTML = '<div class="p-4 text-center text-stone-500">数据加载中...请稍候刷新</div>';
        // Try again in a moment
        setTimeout(renderDietPage, 500);
        return;
    }

    const data = dietEngine.getRecommendations();
    
    // 1. Render Wellness Board (Horizontal Scroll)
    const boardHtml = `
    <div class="bg-gradient-to-br from-white/40 to-orange-50/30 backdrop-blur-2xl rounded-3xl p-5 mb-6 shadow-[0_8px_32px_0_rgba(255,255,255,0.3)] border border-white/60 ring-1 ring-white/40 relative overflow-hidden">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
                <div class="text-xs font-bold text-[#8B4513] mb-1 flex flex-wrap items-center gap-2">
                    <span>${data.info.lunarDate}</span>
                    <span class="w-1 h-1 rounded-full bg-[#8B4513]"></span>
                    <span>${data.info.term}</span>
                    ${data.info.isFastDay ? `<span class="bg-[#8B4513] text-white px-2 py-0.5 rounded-lg text-[10px] shadow-sm">${data.info.fastDayLabel}</span>` : ''}
                </div>
                ${data.info.festivals ? `<div class="text-[10px] text-[#8B4513]/80 font-bold mb-1">🎊 ${data.info.festivals}</div>` : ''}
                <div class="text-xl font-bold text-[#5c4033] font-serif tracking-wide">时令养生</div>
            </div>
            <div class="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-xl shadow-inner border border-white/30">
                🎋
            </div>
        </div>
        
        <div class="bg-white/40 rounded-2xl p-4 mb-4 backdrop-blur-sm border border-white/30">
            <div class="text-sm text-[#5c4033] font-medium leading-relaxed flex gap-3">
                <span class="text-[#8B4513] font-bold text-lg">💡</span>
                <span class="opacity-90">${data.info.advice}</span>
            </div>
        </div>

        <!-- Recommended Cards (Horizontal Scroll) -->
        <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
            ${data.recipes.map(r => {
                const originalIndex = window.recipeData.findIndex(item => item.id === r.id);
                return `
                <div class="min-w-[140px] w-[140px] bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white/50 snap-start flex-shrink-0 relative group cursor-pointer transition-transform active:scale-95" onclick="toggleRecipeAndScroll(${originalIndex})">
                     <div class="absolute top-1 right-1 bg-[#8B4513]/10 text-[#8B4513] text-[10px] px-1.5 py-0.5 rounded-md z-10 font-bold border border-[#8B4513]/10">
                        ${r.recommendationBadge}
                     </div>
                     <div class="h-24 bg-[#f0ece6]/50 flex items-center justify-center text-4xl">
                        🥗
                     </div>
                     <div class="p-3">
                        <div class="font-bold text-[#5c4033] text-xs truncate mb-1.5">${r.name}</div>
                        <div class="flex gap-1 flex-wrap">
                            ${r.colors.slice(0,2).map(c => {
                                const map = (typeof COLOR_MAP !== 'undefined' ? COLOR_MAP[c] : null);
                                return `<span class="w-2 h-2 rounded-full ${map?.dot || 'bg-gray-400'} shadow-sm"></span>`;
                            }).join('')}
                        </div>
                     </div>
                </div>
            `}).join('')}
        </div>
    </div>
    
    <!-- Separator -->
    <div class="flex items-center gap-3 mb-6 px-2 opacity-60">
        <div class="h-px bg-[#8B4513]/20 flex-1"></div>
        <div class="text-xs text-[#8B4513] font-bold tracking-widest uppercase">全部素斋</div>
        <div class="h-px bg-[#8B4513]/20 flex-1"></div>
    </div>
    `;

    // 2. Render All Recipes
    const listHtml = window.recipeData.map((r, idx) => renderRecipeCard(r, idx)).join('');

    container.innerHTML = boardHtml + '<div class="space-y-4">' + listHtml + '</div>';
    
    // Add bottom padding
    container.innerHTML += '<div class="h-8"></div>';
}

function toggleRecipeAndScroll(idx) {
    // Open the recipe
    const content = document.getElementById(`content-recipe-${idx}`);
    const icon = document.getElementById(`icon-recipe-${idx}`);
    
    if (content && content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if(icon) icon.classList.add('rotate-180');
    }
    
    // Scroll to it
    const card = document.getElementById(`recipe-card-${idx}`);
    if (card) {
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// Helper to render a single card (extracted from original renderZenMeal)
function renderRecipeCard(r, idx) {
      // Nutrient Logic
      const proteinPercent = Math.min(100, (r.nutrients.protein / 20) * 100);
      const fiberLeaves = Array(Math.min(5, Math.max(1, Math.round(r.nutrients.fiber / 2)))).fill('🌿').join('');
      
      // Badges
      let badges = '';
      if (r.nutrients.iron > 5) badges += `<div class="absolute -top-1 -right-1 bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full border border-yellow-200 shadow-sm z-10">🥇 补铁首选</div>`;
      if (r.nutrients.calcium > 50) badges += `<div class="absolute -top-1 ${r.nutrients.iron > 5 ? 'right-20' : '-right-1'} bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded-full border border-orange-200 shadow-sm z-10">🥇 高钙</div>`;

      // Colors
      const colorBadges = r.colors.map(c => {
          const map = (typeof COLOR_MAP !== 'undefined' ? COLOR_MAP[c] : null) || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: c };
          if (!map) return '';
          return `<div class="${map.bg} ${map.text} px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 border border-white/50 shadow-sm"><span class="w-1.5 h-1.5 rounded-full ${map.dot}"></span>${map.label}</div>`;
      }).join('');

      return `
    <div class="bg-white/40 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 ring-1 ring-white/30 overflow-hidden mb-4 relative group transition-all duration-300 hover:shadow-md" id="recipe-card-${idx}">
        <!-- Header -->
        <div class="p-3 bg-white/40 flex justify-between items-center cursor-pointer border-b border-white/30 hover:bg-white/60 transition-colors" onclick="toggleRecipe(${idx})">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#dcece2]/50 flex items-center justify-center text-xl shadow-sm border border-white/50">🥗</div>
                <div>
                    <div class="font-bold text-[#5c4033] text-sm">${r.name}</div>
                    <div class="text-[10px] text-[#8B4513]/60 italic font-serif">${r.quote}</div>
                </div>
            </div>
            <div class="w-8 h-8 flex items-center justify-center text-[#8B4513]">
                <svg id="icon-recipe-${idx}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 transition-transform duration-300">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </div>
        
        <!-- Content -->
        <div id="content-recipe-${idx}" class="hidden bg-transparent p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            
            <!-- Nutrient Dashboard (Bento Grid) -->
            <div class="grid grid-cols-2 gap-2 relative">
                ${badges}
                <!-- Protein -->
                <div class="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between backdrop-blur-sm">
                    <div class="text-[10px] text-[#8B4513]/40 uppercase tracking-wider mb-1">蛋白质 Protein</div>
                    <div class="w-full bg-[#8B4513]/10 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-[#8ba88e] h-full rounded-full transition-all duration-1000" style="width: ${proteinPercent}%"></div>
                    </div>
                    <div class="text-right text-[10px] text-[#8ba88e] font-bold mt-1">${r.nutrients.protein}g / 20g</div>
                </div>
                
                <!-- Fiber -->
                <div class="bg-white/50 p-2.5 rounded-xl border border-green-100/50 flex flex-col justify-between backdrop-blur-sm">
                    <div class="text-[10px] text-green-800/60 uppercase tracking-wider mb-1">膳食纤维 Fiber</div>
                    <div class="text-lg tracking-widest">${fiberLeaves}</div>
                </div>
                
                <!-- Minerals & Badges -->
                <div class="col-span-2 bg-white/50 p-2.5 rounded-xl border border-orange-100/50 flex items-center justify-between backdrop-blur-sm">
                     <div class="flex gap-4">
                         <div>
                             <div class="text-[10px] text-orange-800/60 uppercase tracking-wider">铁 Iron</div>
                             <div class="text-xs font-bold text-orange-700">${r.nutrients.iron}mg</div>
                         </div>
                         <div>
                             <div class="text-[10px] text-orange-800/60 uppercase tracking-wider">钙 Calcium</div>
                             <div class="text-xs font-bold text-orange-700">${r.nutrients.calcium}mg</div>
                         </div>
                     </div>
                     <div class="flex gap-1 flex-wrap justify-end max-w-[50%]">
                         ${colorBadges}
                     </div>
                </div>
            </div>

            <!-- Tips -->
            <div class="bg-white/40 p-3 rounded-lg border-l-4 border-[#8B4513]">
                <div class="text-[10px] font-bold text-[#8B4513] uppercase tracking-wider mb-1">药膳贴士</div>
                <div class="text-xs text-[#5c4033] leading-relaxed">${r.tips}</div>
            </div>

            <!-- Ingredients & Steps -->
            <div class="grid grid-cols-1 gap-3">
                 <div>
                    <div class="text-[10px] font-bold text-[#8B4513]/40 uppercase tracking-wider mb-1.5">食材</div>
                    <div class="flex flex-wrap gap-1.5">
                        ${r.ingredients.map(i => `<span class="px-2 py-0.5 bg-white/60 text-[#5c4033] text-xs rounded-md border border-white/50 shadow-sm">${i}</span>`).join('')}
                    </div>
                 </div>
                 <div>
                    <div class="text-[10px] font-bold text-[#8B4513]/40 uppercase tracking-wider mb-1.5">做法</div>
                    <ol class="list-decimal list-inside text-xs text-[#5c4033] space-y-1.5 leading-relaxed marker:text-[#8B4513]/50">
                        ${r.steps.map(s => `<li>${s}</li>`).join('')}
                    </ol>
                 </div>
            </div>
        </div>
    </div>
  `;
}

// Global Toggle Function
window.toggleRecipe = function(idx) {
    const content = document.getElementById(`content-recipe-${idx}`);
    const icon = document.getElementById(`icon-recipe-${idx}`);
    
    if (content) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            if(icon) icon.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            if(icon) icon.classList.remove('rotate-180');
        }
    }
}

// Override original fetchZenMeal to use new render
window.fetchZenMeal = async function(force = false) {
    renderDietPage();
};
