function createFooter() {
  var footer = document.createElement("footer");
  var footerContent = document.createElement("div");
  footerContent.classList.add("footer-content");

  var socialIcons = createContentBox("Connect", null);
  socialIcons.appendChild(createSocialIcons());
  footerContent.appendChild(socialIcons);

  var quickLinks = createContentBox("Quick Links", null);
  quickLinks.appendChild(createLinks());
  footerContent.appendChild(quickLinks);

  footer.appendChild(footerContent);
  document.body.appendChild(footer);

  var legalInfo = document.createElement("div");
  legalInfo.classList.add("legal");
  legalInfo.innerHTML =
    "&copy; 2024 AMA Health Hub. All rights reserved. <a href='#'>Privacy Policy</a> <a href='#'>Terms of Service</a>";
  footer.appendChild(legalInfo);
}

function createContentBox(title, content) {
  var box = document.createElement("div");
  box.classList.add("content-box");
  if (title) {
    var titleElement = document.createElement("h3");
    titleElement.textContent = title;
    box.appendChild(titleElement);
  }
  if (content) {
    var contentElement = document.createElement("p");
    contentElement.innerHTML = content;
    box.appendChild(contentElement);
  }
  return box;
}

function createLinks() {
  var links = document.createElement("div");
  links.classList.add("links");

  var linkNames = [
    "Home",
    "Recipe",
    "Quiz",
    "Meal Planning",
    "Credits",
    "Login",
  ];

  // Get the current URL
  var currentPath = window.location.pathname;

  // Check if the current path includes 'public/html' to determine the correct path
  var basePath = currentPath.includes("public/html") ? "./" : "public/html/";

  linkNames.forEach(function (name) {
    var link = document.createElement("a");

    if (name === "Home") {
      link.textContent = name;
      link.href = currentPath.includes("public/html")
        ? "../../index.html"
        : "index.html";
    } else if (name === "Meal Planning") {
      link.textContent = name;
      link.href = basePath + "meal_planning.html";
    } else {
      link.textContent = name;
      link.href = basePath + name.toLowerCase().replace(" ", "") + ".html";
    }

    links.appendChild(link);
  });

  return links;
}

function createSocialIcon(alt, src, link) {
  var icon = document.createElement("a");
  icon.href = link;
  icon.target = "_blank"; // Open the link in a new tab
  var image = document.createElement("img");
  image.alt = alt;
  image.src = src;
  icon.appendChild(image);
  return icon;
}

function createSocialIcons() {
  var socialIcons = document.createElement("div");
  socialIcons.classList.add("social-icons");
  var instagram = createSocialIcon(
    "Instagram",
    "https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-logo-instagram-ini-ada-varias-dan-transparan-33.png",
    "https://www.instagram.com/uniqlosg/?hl=en"
  );
  socialIcons.appendChild(instagram);
  var facebook = createSocialIcon(
    "Facebook",
    "https://www.facebook.com/images/fb_icon_325x325.png",
    "https://www.facebook.com/uniqlo.sg/"
  );
  socialIcons.appendChild(facebook);
  return socialIcons;
}

createFooter();
