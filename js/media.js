import { getSuggestions } from "./mediaService.js";

const resultsContainer = document.querySelector('#results');
resultsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;

    const title = btn.dataset.title;
    console.log("Adding favorite:", title);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.includes(title)) {
        btn.textContent = "Saved";
        btn.disabled = true;
        console.log("Already in favorites:", title);
        return;
    }

    favorites.push(title);
    btn.textContent = "Saved";
    btn.disabled = true;
    localStorage.setItem("favorites", JSON.stringify(favorites));

});

const buttonSuggest = document.querySelector("#get-suggestions");

//escucha el evento trae los valores, y crea la card 
buttonSuggest.addEventListener("click", () => {
    const level = document.querySelector('input[name="level"]:checked').value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const query = document.querySelector("#query").value;

    const results = getSuggestions({ type, level, query });
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <p class="text-slate-400 text-sm">
                No results found. Try changing filters.
            </p>
        `;
        return;
    }

    const html = results.map(item => `
            <article class="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
                <h4 class="text-slate-100 font-semibold">${item.title}</h4>
                <p class="mt-1 text-slate-400 text-sm">
                    ${item.type.toUpperCase()} · ${item.level} · ${item.source}
                </p>
                <a href="${item.url}" class="mt-3 inline-flex text-blue-400 hover:text-blue-300 transition-colors" target="_blank" rel="noopener">
                    Open   
                </a>
                <button class="fav-btn" data-title="${item.title}">Add to favorites</button>

            </article>
        `).join("");

    resultsContainer.innerHTML = html;


});


