document.addEventListener("DOMContentLoaded", function () {
  const technologies = [
    {
      name: "HTML",
      description: "Used to create the basic structure of the website.",
      link: "https://html.spec.whatwg.org/",
    },
    {
      name: "CSS",
      description:
        "Used for styling and layout, ensuring a visually appealing and consistent design across the website.",
      link: "https://www.w3.org/Style/CSS/Overview.en.html",
    },
    {
      name: "JavaScript",
      description:
        "Adds interactivity and dynamic features to the website, enhancing the user experience.",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
      name: "GitHub",
      description: "Used for code hosting, version control, and collaboration.",
      link: "https://github.com/",
    },
    {
      name: "Figma",
      description: "Used for prototyping and user interface (UI) design.",
      link: "https://www.figma.com/",
    },
    {
      name: "Bootstarp",
      description: "Used for making the website responsive.",
      link: "https://getbootstrap.com/docs/5.3/getting-started/introduction/#cdn-links",
    },
  ];

  const techList = document.getElementById("tech-list");
  technologies.forEach((tech) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="tech-item">
                <span class="tech-name">${tech.name}</span>
                <p class="tech-description">${tech.description}</p>
                <a href="${tech.link}" target="_blank" class="tech-link">Official Website</a>
            </div>
        `;
    techList.appendChild(li);
  });

  const imageCredits = [
    "https://www.ntuc.org.sg/uportal/about-us/social-enterprises/ntuc-fairprice",
    "https://www.mrbean.com.sg/",
    "https://pss.hpb.gov.sg/",
    "https://www.facebook.com/lihosg/",
    "https://simplywrapps.oddle.me/en_SG/",
    "https://www.eatingbirdfood.com/grilled-chicken-salad/",
    "https://www.eatingwell.com/recipe/7575315/grilled-chicken-with-summer-vegetables/",
    "https://www.twopeasandtheirpod.com/zucchini-noodles-with-pesto/",
    "https://cafedelites.com/one-pan-lemon-garlic-baked-salmon-asparagus/",
    "https://www.thekitchenmagpie.com/greek-yogurt-with-berries-and-honey/",
    "https://www.seriouseats.com/recipes/topics/diet/vegan",
    "https://therealfooddietitians.com/tex-mex-quinoa-salad/",
    "https://thecozycook.com/eggplant-parmesan/",
    "https://www.loveandlemons.com/mushroom-risotto/",
    "https://rainbowplantlife.com/tofu-stir-fry/",
    "https://delishar.com/quinoa-salad-with-grilled-maple-chicken/",
    "https://grainfreetable.com/5-cheese-marinara/",
    "https://www.delish.com/cooking/recipe-ideas/a56006/how-to-make-sweet-potatoes/",
    "https://www.mamaknowsglutenfree.com/gluten-free-pancakes/",
    "https://healthynibblesandbits.com/vietnamese-spring-rolls/",
    "https://minimalistbaker.com/the-best-gluten-free-pizza-crust-sauce/",
    "https://www.allrecipes.com/recipe/13978/lentil-soup/",
    "https://hot-thai-kitchen.com/laksa/",
    "https://www.justasdelish.com/satay-kajang-malaysian-satay/",
    "https://www.andy-cooks.com/blogs/recipes/nasi-lemak",
    "https://noobcook.com/hokkien-mee/",
    "https://christieathome.com/blog/char-kway-teow/",
    "https://www.spendwithpennies.com/strawberry-banana-smoothie/",
    "https://www.loveandlemons.com/green-smoothie/",
    "https://chocolatecoveredkatie.com/peanut-butter-banana-smoothie/",
    "https://feelgoodfoodie.net/recipe/avocado-smoothie/",
    "https://www.nmamilife.com/lifestyle/5-lifestyle-habits-for-better-sleep/",
    "https://www.freepik.com/premium-vector/immunity-system-logo-template-human-immune-system-vector-design-flat-vector-illustration_28623110.htm",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTrqQ31oG3fJ6LKMGJa6Yy77uHTgZU9fgI1jLUiB9VZZhqvHv2K",
    "https://www.vectorstock.com/royalty-free-vector/life-expectancy-blue-gradient-concept-icon-vector-42350254",
    "https://www.vecteezy.com/vector-art/10427968-lower-risk-of-heart-disease-concept-icon-heart-attack-prevention-veganism-benefit-abstract-idea-thin-line-illustration-isolated-outline-drawing-editable-stroke",
    "https://www.vecteezy.com/vector-art/39303244-vitality-concept-line-icon-simple-element-illustration-vitality-concept-outline-symbol-design",
  ];

  const imageCreditsContainer = document.getElementById("image-credits");
  imageCredits.forEach((credit) => {
    const div = document.createElement("div");
    div.className = "image-credit";
    div.innerHTML = `<a href="${credit}" target="_blank">${credit}</a>`;
    imageCreditsContainer.appendChild(div);
  });
});
