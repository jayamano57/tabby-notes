const elements = {
  container: document.querySelector(".container"),
  textarea: document.querySelector(".textarea"),
  themeBtn: document.querySelector(".theme-btn"),
};

// Chrome Helper Functions
const getCurrentTab = async () => {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

// Utility Functions
const debounce = (f, time) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      f(...args);
    }, time);
  };
};

// Note Actions
const handleOnLoad = async () => {
  const { container, textarea } = elements;
  const currentTab = await getCurrentTab();

  // initialize note
  const currentNotes = await chrome.storage.local.get([`tab-${currentTab.id}`]);
  const notes = currentNotes[`tab-${currentTab.id}`];

  if (notes) {
    textarea.textContent = notes;
  }

  // initialize theme
  const currentSettings = await chrome.storage.local.get([`theme`]);
  const theme = currentSettings[`theme`];

  if (theme === "light") {
    container.classList.remove("dark");
    container.classList.add("light");
  } else if (theme === "dark") {
    container.classList.add("dark");
    container.classList.remove("light");
  }
};

const saveNote = async (e) => {
  const currentTab = await getCurrentTab();
  await chrome.storage.local.set({ [`tab-${currentTab.id}`]: e.target.value });
};

const changeTheme = async (e) => {
  const { container } = elements;

  const isLight = container.classList.contains("light");

  if (isLight) {
    container.classList.remove("light");
    container.classList.add("dark");

    await chrome.storage.local.set({ [`theme`]: "dark" });
  } else {
    container.classList.add("light");
    container.classList.remove("dark");

    await chrome.storage.local.set({ [`theme`]: "light" });
  }
};

const initializeApp = () => {
  const { textarea, themeBtn } = elements;
  window.onload = handleOnLoad;
  textarea.addEventListener("keydown", debounce(saveNote, 1000));
  themeBtn.addEventListener("click", changeTheme);
};

document.addEventListener("DOMContentLoaded", initializeApp);
