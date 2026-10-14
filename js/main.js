// Main js script for AT2026 prototype

const forestButton = document.getElementById("forestButton");
const riverButton = document.getElementById("riverButton");
const storyText = document.getElementById("storyText");
const choiceText = document.getElementById("choiceText");

const loadChoicesButton = document.getElementById("loadChoicesButton");
const cloudStatus = document.getElementById("cloudStatus");
const savedChoices = document.getElementById("savedChoices");

// connecting to supabase
const supabaseUrl = "https://suuqhqyfljjxqbwsqclg.supabase.co";
const supabaseKey = "sb_publishable_b11qH1kQNEike7U6EZUV7A_XnEcT9Cf";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Function to load saved choices
async function loadChoices() {
    cloudStatus.textContent = "Loading choices...";

    try {
        const { data, error } = await supabaseClient
            .from("test_choices")
            .select("choice, created_at")
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) {
            console.error("Could not load choices:", error.message || error);
            cloudStatus.textContent = "Could not load choices. Check the console.";
            return;
        }

        if (!data) {
            cloudStatus.textContent = "No choices found.";
            savedChoices.replaceChildren();
            return;
        }

        savedChoices.replaceChildren();

        for (const record of data) {
            const item = document.createElement("li");
            item.textContent = record.choice + " — " + record.created_at;
            savedChoices.appendChild(item);
        }

        cloudStatus.textContent = "Loaded " + data.length + " saved choices.";
    } catch (err) {
        console.error("Unexpected error loading choices:", err);
        cloudStatus.textContent = "Could not load choices. Check the console.";
    }
}

// Listener for button click
loadChoicesButton.addEventListener("click", loadChoices);

// Function to save player choice to Supabase
async function saveChoice(choice) {
    try {
        const { data, error } = await supabaseClient
            .from("test_choices")
            .insert({ choice: choice })
            .select();

        if (error) {
            console.error("Could not save choice:", error.message || error);
            alert("The choice could not be saved. Check the browser console.");
            return { success: false, error };
        }

        console.log("Choice saved:", data);
        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error saving choice:", err);
        alert("The choice could not be saved. Check the browser console.");
        return { success: false, error: err };
    }
}

let playerChoice = "";

// Attach click handlers that update UI and persist the choice
forestButton.addEventListener("click", async function () {
    playerChoice = "forest";
    storyText.textContent = "You enter the dark forest. Something moves between the trees.";
    choiceText.textContent = "You chose the forest path.";
    await saveChoice(playerChoice);
});

riverButton.addEventListener("click", async function () {
    playerChoice = "river";
    storyText.textContent = "You follow the river and discover an abandoned wooden boat.";
    choiceText.textContent = "You chose the river path.";
    await saveChoice(playerChoice);
});
