const colorChange = document.querySelector("#colorHex");
const hexTxt = document.querySelector("#colorHexDisplay");
const output = document.querySelector("#output");
const emptyState = document.querySelector("#emptyState");

const dialog = document.querySelector("#dialog");
const saveBtn = document.querySelector("#saveColor");
const saveTxt = document.querySelector("#saveTxt");
const iconAction = document.querySelector("#icon-action");

const titleKh = document.querySelector("#titleKh");
const titleEn = document.querySelector("#titleEn");



// ============================= Action Event
colorChange.addEventListener("input", function () {
    handleChangeColor(colorChange.value)
})

saveBtn.addEventListener("click", async function () {
    saveBtn.disabled = true;
    saveBtn.classList.add("opacity-50", "cursor-not-allowed");
    iconAction.textContent = "cached";
    iconAction.classList.add("animate-spin");
    saveTxt.textContent = "Saving...";

    // Validate the input field first
    if (titleEn.value.length == 0 || titleKh.value.length == 0) {
        setTimeout(function () {
            saveBtn.disabled = false;
            saveBtn.classList.remove("opacity-50", "cursor-not-allowed");
            saveTxt.textContent = "Save";
            iconAction.textContent = "save";
            iconAction.classList.remove("animate-spin");
            showToast("Please enter the value in both title English and ខ្មែរ", "error");
        }, 2000)

        
        return;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.error("Failed to deactivate:", error);
    } finally {
        saveBtn.disabled = false;
        saveBtn.classList.remove("opacity-50", "cursor-not-allowed");
        saveTxt.textContent = "Save";
        iconAction.textContent = "save";
        iconAction.classList.remove("animate-spin");
        dialog.close();
    }
})


// ============================= Fuction
function handleChangeColor(hex) {
    hexTxt.value = hex;
    hexTxt.className = `rounded-full px-4 py-2 ring-1 focus-visible:ring-2 ring-[${hex}]/50 outline-0 bg-zinc-50 text-[${hex}]`;

}

function handleSaveColor() {

}

function handleRenderColor() {
    const colors = localStorage.getItem("colors") ?? [];
    if (colors.length == 0) {
        emptyState.classList.remove("hidden")
    } else {
        emptyState.classList.add("hidden");

        colors.forEach((color) => {
            output.appendChild(
                `
                <div
                    class="flex items-center justify-between shadow-sm rounded-xl px-4 py-3"
                >
                    <div class="flex items-center gap-3">
                        <div
                        class="p-5 bg-blue-500 rounded-full border border-slate-500"
                        ></div>
                        <div class="flex flex-col">
                            <span class="text-sm">Blue</span>
                            <span class="text-sm">ខៀវ</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <button
                            class="bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-600 px-1.5 py-1 text-xs rounded-full cursor-pointer"
                        >
                            <span class="material-icons"> mode_edit </span>
                        </button>
                        <button
                            class="bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 px-1.5 py-1 text-xs rounded-full cursor-pointer"
                        >
                            span class="material-icons"> delete_forever </span>
                        </button>
                    </div>
                </div>
            `
            );
        })

    }
}

const saveColorToStorage = (newColorPayload) => {
    const existingColors = JSON.parse(localStorage.getItem("colors")) || [];
    existingColors.push(newColorPayload);
    localStorage.setItem("colors", JSON.stringify(existingColors));
};

function handleReformatData(hex, titleKh, titleEn, createdAt) {
    return {
        id: generateUniqueId(),
        titleEn: titleEn,
        titleKh: titleKh,
        hex: hex,
        createdAt: createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

function generateUniqueId() {
    return Math.random().toString(36).substring(2, 11);
}

const showToast = (message, type = 'success') => {
    let container = document.querySelector("#toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-5 left-1/2 -translate-x-1/2 z-[99] flex flex-col gap-2 pointer-events-none";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const baseStyles = "pointer-events-auto flex items-center px-4 py-3 rounded-full shadow-lg text-sm font-medium transition-all duration-300 transform translate-y-[-20px] opacity-0 backdrop-blur-md border animate-fade-in-up";

    const themes = {
        success: "bg-emerald-500/90 text-white border-emerald-400/20",
        error: "bg-rose-500/90 text-white border-rose-400/20",
        info: "bg-slate-900/90 text-white border-slate-800"
    };

    toast.className = `${baseStyles} ${themes[type] || themes.success}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove("translate-y-[-20px]", "opacity-0");
    });

    setTimeout(() => {
        toast.classList.add("translate-y-[-20px]", "opacity-0");
        toast.addEventListener("transitionend", () => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        });
    }, 3000);
};

handleChangeColor(colorChange.value);
handleRenderColor();