
# MedWord — Medical Word of the Day (Static Site)

A simple, fast, and student-friendly website you can host for free (GitHub Pages, Netlify, Vercel). Edit JSON files to add words and facts. No backend needed.

## Files
- `index.html` — main page
- `styles.css` — theme and layout
- `script.js` — logic for word of the day, facts, quiz, search
- `data/words.json` — your glossary terms (add sources here)
- `data/facts.json` — short medical facts (keep them general and cite if needed)

## How to add a new word
1. Open `data/words.json`.
2. Add an object using this template:
```json
{
  "term": "Ligament",
  "pronunciation": "LIG-uh-ment",
  "partOfSpeech": "noun",
  "shortDefinition": "A band of connective tissue that connects bones to bones.",
  "longDefinition": "Ligaments stabilize joints by connecting bones. They are made of tough, elastic connective tissue.",
  "example": "An ankle sprain can stretch or tear ligaments around the joint.",
  "tags": ["anatomy"],
  "sources": [
    {"name": "Resource Name", "url": "https://example.com"}
  ]
}
```
3. Save. The site will automatically use the new entry.

## How the Word of the Day is chosen
It deterministically picks an index based on the current date, so everyone sees the same word each day.

## Disclaimer
This site is **for educational purposes only and is not medical advice**. Encourage readers to consult qualified professionals for health concerns.

## Deploy (GitHub Pages)
1. Create a new GitHub repository (public).
2. Upload the `site/` folder content to the repository root.
3. In **Settings → Pages**, set **Branch: main** and **/ (root)**. Save.
4. Wait 1–2 minutes. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Deploy (Netlify)
1. Go to netlify.com → drag & drop the `site/` folder into the dashboard, or connect your Git repo.
2. It deploys automatically and gives you a URL you can customize.

## Ideas to grow
- Post daily on Instagram/TikTok and link back to the site.
- Invite teachers or med students to suggest terms.
- Bundle printable study sheets as freebies (collect emails with a mailing list tool).

## Attribution & Sources
Add sources for each definition in `data/words.json` using the `sources` array. You can cite textbooks, websites from universities, or medical organizations.
