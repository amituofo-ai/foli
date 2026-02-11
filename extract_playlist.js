const fs = require('fs');

function extract(filename) {
    if (!fs.existsSync(filename)) return [];
    const content = fs.readFileSync(filename, 'utf8');
    
    // Attempt to parse ytInitialData
    const initialDataMatch = content.match(/var ytInitialData = ({.*?});/);
    if (initialDataMatch) {
        try {
            const data = JSON.parse(initialDataMatch[1]);
            const videos = [];
            
            function traverse(obj) {
                if (!obj || typeof obj !== 'object') return;
                
                if (obj.playlistVideoRenderer) {
                    const v = obj.playlistVideoRenderer;
                    const id = v.videoId;
                    const index = v.index ? v.index.simpleText : null;
                    let title = "";
                    if (v.title.runs) title = v.title.runs[0].text;
                    else if (v.title.simpleText) title = v.title.simpleText;
                    
                    if (id && title) {
                        videos.push({ id, title, index });
                    }
                }
                
                // Avoid traversing into unrelated huge objects if possible, but for safety traverse all
                if (Array.isArray(obj)) {
                    obj.forEach(traverse);
                } else {
                    for (const key in obj) {
                        traverse(obj[key]);
                    }
                }
            }
            traverse(data);
            if (videos.length > 0) return videos;
        } catch (e) {
            // ignore
        }
    }
    
    // Fallback Regex
    const matches = [];
    const regex = /"playlistVideoRenderer":\{"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]\}/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push({ id: match[1], title: match[2] });
    }
    return matches;
}

const p1 = extract('playlist1.html');
const p2 = extract('playlist2.html');

console.log(JSON.stringify({ p1, p2 }, null, 2));
