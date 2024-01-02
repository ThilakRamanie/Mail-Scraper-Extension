let scrapeEmails = document.getElementById("scrapeEmails");
let list = document.getElementById("emailLists");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let emails = request.emails;
  // alert(emails);
  if (emails == null || emails.length == 0) {
    let li=document.createElement("li");
    li.innerText = "No emails found!";
    list.appendChild(li);
  } else {
    emails.map((email) => {
      let li=document.createElement("li");
      li.innerText = email;
      list.appendChild(li);
    });
  }
});

scrapeEmails.addEventListener("click", async () => {
  // alert("hello");
  //get current active window
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // Execute email parsing
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeEmailsFromPage,
  });
});

function scrapeEmailsFromPage() {
  // alert("Scraped");
  const emailRegex = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;
  //parse emails from html of page
  let emails = document.body.innerHTML.match(emailRegex);
  //send emails to popup
  chrome.runtime.sendMessage({ emails });
}
