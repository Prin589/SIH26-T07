"use strict";

/*
 * ChainShield Security Monitor
 *
 * IMPORTANT:
 * This is a frontend demonstration.
 *
 * Do NOT put:
 * - private keys
 * - seed phrases
 * - API secrets
 * - exchange credentials
 * - authentication tokens
 *
 * into this JavaScript.
 */


/* -----------------------------
   Sample security alerts
------------------------------ */

const alerts = [
    {
        level: "critical",
        icon: "🚨",
        title: "Suspicious contract interaction",
        description:
            "A wallet attempted to interact with a contract that has an elevated risk score.",
        time: "2 minutes ago"
    },
    {
        level: "warning",
        icon: "🎣",
        title: "Potential phishing domain",
        description:
            "A domain resembling a known cryptocurrency service was detected.",
        time: "8 minutes ago"
    },
    {
        level: "warning",
        icon: "⚠️",
        title: "Unusual transaction",
        description:
            "Transaction value is significantly higher than the wallet's normal activity.",
        time: "14 minutes ago"
    },
    {
        level: "info",
        icon: "🔐",
        title: "Security policy reminder",
        description:
            "Consider enabling phishing-resistant MFA on important accounts.",
        time: "25 minutes ago"
    }
];


/* -----------------------------
   Sample blockchain transactions
------------------------------ */

const transactions = [
    {
        hash: "0x81a2...4d91",
        network: "Ethereum",
        amount: "0.42 ETH",
        risk: "Low",
        status: "Confirmed"
    },
    {
        hash: "0x921b...f811",
        network: "Polygon",
        amount: "120 USDC",
        risk: "Low",
        status: "Confirmed"
    },
    {
        hash: "0x19fd...a821",
        network: "Ethereum",
        amount: "4.8 ETH",
        risk: "High",
        status: "Review"
    },
    {
        hash: "bc1q...72kx",
        network: "Bitcoin",
        amount: "0.008 BTC",
        risk: "Medium",
        status: "Confirmed"
    },
    {
        hash: "0xa9b2...912c",
        network: "Polygon",
        amount: "250 USDC",
        risk: "Low",
        status: "Confirmed"
    }
];


/* -----------------------------
   Render alerts
------------------------------ */

const alertsList = document.getElementById("alertsList");

function renderAlerts() {

    /*
     * Security note:
     *
     * We use textContent rather than innerHTML for data that
     * could eventually come from an external API.
     *
     * This reduces DOM XSS risk.
     */

    alertsList.replaceChildren();

    alerts.forEach(alert => {

        const wrapper = document.createElement("div");
        wrapper.className = `alert alert-${alert.level}`;

        const icon = document.createElement("div");
        icon.className = "alert-icon";
        icon.textContent = alert.icon;

        const content = document.createElement("div");
        content.className = "alert-content";

        const title = document.createElement("strong");
        title.textContent = alert.title;

        const description = document.createElement("p");
        description.textContent = alert.description;

        const time = document.createElement("span");
        time.className = "alert-time";
        time.textContent = alert.time;

        content.append(title, description, time);
        wrapper.append(icon, content);

        alertsList.appendChild(wrapper);
    });

    document.getElementById("alertCount").textContent = alerts.length;
}


/* -----------------------------
   Render transactions
------------------------------ */

const transactionTable =
    document.getElementById("transactionTable");

const networkFilter =
    document.getElementById("networkFilter");


function renderTransactions(network = "all") {

    transactionTable.replaceChildren();

    const filtered =
        network === "all"
            ? transactions
            : transactions.filter(tx => tx.network === network);

    filtered.forEach(tx => {

        const row = document.createElement("tr");

        const hash = document.createElement("td");
        hash.className = "hash";
        hash.textContent = tx.hash;

        const networkCell = document.createElement("td");
        networkCell.textContent = tx.network;

        const amount = document.createElement("td");
        amount.textContent = tx.amount;

        const risk = document.createElement("td");

        const riskBadge = document.createElement("span");

        riskBadge.textContent = tx.risk;
        riskBadge.className =
            "risk risk-" + tx.risk.toLowerCase();

        risk.appendChild(riskBadge);

        const status = document.createElement("td");
        status.className =
            tx.status === "Confirmed"
                ? "status"
                : "risk-high";

        status.textContent = tx.status;

        row.append(
            hash,
            networkCell,
            amount,
            risk,
            status
        );

        transactionTable.appendChild(row);
    });
}


networkFilter.addEventListener("change", event => {
    renderTransactions(event.target.value);
});


/* -----------------------------
   Refresh alerts
------------------------------ */

document
    .getElementById("refreshAlerts")
    .addEventListener("click", () => {

        const button =
            document.getElementById("refreshAlerts");

        button.textContent = "Refreshing...";

        setTimeout(() => {

            button.textContent = "Refresh";

            const newAlert = {
                level: "info",
                icon: "🔄",
                title: "Monitoring refreshed",
                description:
                    "Blockchain security monitoring data was refreshed.",
                time: "Just now"
            };

            alerts.unshift(newAlert);

            renderAlerts();

        }, 600);
    });


/* -----------------------------
   Security checklist
------------------------------ */

const checklist =
    document.getElementById("checklist");

const checklistScore =
    document.getElementById("checklistScore");

const securityScore =
    document.getElementById("securityScore");


function updateSecurityScore() {

    const items =
        checklist.querySelectorAll("input[type='checkbox']");

    let completed = 0;
    let score = 0;

    items.forEach(item => {

        if (item.checked) {
            completed++;

            score += Number(item.dataset.score || 0);
        }
    });

    checklistScore.textContent =
        `${completed} / ${items.length}`;

    /*
     * This is only a UI score.
     * A real security assessment should be much more
     * comprehensive.
     */

    securityScore.textContent =
        Math.min(100, 50 + score);
}


checklist.addEventListener("change", updateSecurityScore);


/* -----------------------------
   Basic URL phishing heuristic
------------------------------ */

const urlForm =
    document.getElementById("urlForm");

const urlInput =
    document.getElementById("urlInput");

const urlResult =
    document.getElementById("urlResult");


urlForm.addEventListener("submit", event => {

    event.preventDefault();

    const value =
        urlInput.value.trim();

    urlResult.classList.remove(
        "hidden",
        "url-safe",
        "url-danger"
    );


    let parsedURL;

    try {

        parsedURL = new URL(value);

    } catch {

        urlResult.classList.add("url-danger");
        urlResult.textContent =
            "Invalid URL. Do not visit unknown links.";
        return;
    }


    /*
     * Never assume that HTTPS alone means a site is safe.
     * HTTPS encrypts the connection but doesn't prove the
     * website is trustworthy.
     */

    const suspiciousPatterns = [
        "login",
        "verify",
        "wallet",
        "airdrop",
        "claim",
        "security-check",
        "free-token"
    ];

    const hostname =
        parsedURL.hostname.toLowerCase();

    const path =
        parsedURL.pathname.toLowerCase();


    const suspicious =
        suspiciousPatterns.some(pattern =>
            path.includes(pattern)
        );


    if (parsedURL.protocol !== "https:") {

        urlResult.classList.add("url-danger");

        urlResult.textContent =
            "Warning: This URL does not use HTTPS. Do not enter passwords or wallet information.";

        return;
    }


    if (suspicious) {

        urlResult.classList.add("url-danger");

        urlResult.textContent =
            `Warning: "${hostname}" contains patterns commonly seen in phishing links. Verify the domain independently before continuing.`;

        return;
    }


    urlResult.classList.add("url-safe");

    urlResult.textContent =
        `No obvious client-side warning detected for "${hostname}". This does NOT prove that the website is legitimate.`;
});


/* -----------------------------
   Initial rendering
------------------------------ */

renderAlerts();
renderTransactions();
updateSecurityScore();