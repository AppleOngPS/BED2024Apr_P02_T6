// Function to create the footer element and append it to the document body
function createFooter() {
  // Create the main footer element
  var footer = document.createElement("footer");

  // Create a container for the footer content
  var footerContent = document.createElement("div");
  footerContent.classList.add("footer-content");

  // Create and add the social icons section
  var socialIcons = createContentBox("Connect", null);
  socialIcons.appendChild(createSocialIcons());
  footerContent.appendChild(socialIcons);

  // Create and add the quick links section
  var quickLinks = createContentBox("Quick Links", null);
  quickLinks.appendChild(createLinks());
  footerContent.appendChild(quickLinks);

  // Append the footer content to the footer
  footer.appendChild(footerContent);

  // Append the footer to the document body
  document.body.appendChild(footer);

  // Create and add the legal information section
  var legalInfo = document.createElement("div");
  legalInfo.classList.add("legal");
  legalInfo.innerHTML =
    "&copy; 2024 AMA Health Hub. All rights reserved. <a href='#'>Privacy Policy</a> <a href='#'>Terms of Service</a>";
  footer.appendChild(legalInfo);
}

// Function to create a content box with a title and optional content
function createContentBox(title, content) {
  var box = document.createElement("div");
  box.classList.add("content-box");

  // Add title if provided
  if (title) {
    var titleElement = document.createElement("h3");
    titleElement.textContent = title;
    box.appendChild(titleElement);
  }

  // Add content if provided
  if (content) {
    var contentElement = document.createElement("p");
    contentElement.innerHTML = content;
    box.appendChild(contentElement);
  }

  return box;
}

// Function to create the quick links section
function createLinks() {
  var links = document.createElement("div");
  links.classList.add("links");

  // Array of link names
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

  // Determine the correct base path for links
  var basePath = currentPath.includes("public/html") ? "./" : "public/html/";

  // Create links for each name in the array
  linkNames.forEach(function (name) {
    var link = document.createElement("a");

    // Set href based on the link name
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

// Function to create a social media icon with a link
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

// Function to create the social icons section
function createSocialIcons() {
  var socialIcons = document.createElement("div");
  socialIcons.classList.add("social-icons");

  // Create and add Instagram icon
  var instagram = createSocialIcon(
    "Instagram",
    "https://www.freepnglogos.com/uploads/logo-ig-png/logo-ig-logo-instagram-ini-ada-varias-dan-transparan-33.png",
    "https://www.instagram.com/uniqlosg/?hl=en"
  );
  socialIcons.appendChild(instagram);

  // Create and add Facebook icon
  var facebook = createSocialIcon(
    "Facebook",
    "https://www.facebook.com/images/fb_icon_325x325.png",
    "https://www.facebook.com/uniqlo.sg/"
  );
  socialIcons.appendChild(facebook);

  return socialIcons;
}

// Call the createFooter function to generate and append the footer
createFooter();
