const fs = require('fs');
const path = require('path');

// Configuration
const playlist1File = path.join(__dirname, 'playlist1.html');
const playlist2File = path.join(__dirname, 'playlist2.html');
const videoDataFile = path.join(__dirname, 'video_data.js');
const audioDataFile = path.join(__dirname, 'audio_data.js');

// Audio Data (from user input)
const audioLinks = [
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656764/20181105%E5%B8%88%E7%88%B6%E7%A0%B4%E6%96%A5%E9%82%AA%E9%81%93%E5%83%A7_hcbo0k.wav",
        title: "20181105师父破斥邪道僧"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656755/20190518%E5%BC%9F%E5%AD%90%E6%80%8E%E4%B9%88%E4%BF%AE_o94a1m.wav",
        title: "20190518弟子怎么修"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656736/20190827%E5%B8%88%E7%88%B6%E5%BC%80%E7%A4%BA%EF%BC%9A%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%92%E5%BE%8B_n2d9ws.wav",
        title: "20190827师父开示：什么是戒律"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656708/20201017%E4%B8%8D%E6%B7%AB%E6%88%92%E7%9A%84%E6%88%92%E6%A0%B9%E6%88%92%E4%BD%93_x7yqau.wav",
        title: "20201017不淫戒的戒根戒体"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656678/20210710%E5%B8%88%E7%88%B6%E5%BC%80%E7%A4%BA%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E8%83%BD%E5%90%83%E8%9B%8B_z5mn6d.wav",
        title: "20210710师父开示：为什么不能吃蛋"
    }
];

function extractTitles(htmlContent, datePattern) {
    const titles = new Set();
    // Regex to match "text":"DATE..." in JSON
    // We look for "text":"(DATE[^"]+)"
    // We also look for title="(DATE[^"]+)"
    
    // Pattern for JSON "text": "..."
    const jsonRegex = new RegExp(`"text":"(${datePattern}[^"]+)"`, 'g');
    let match;
    while ((match = jsonRegex.exec(htmlContent)) !== null) {
        titles.add(match[1]);
    }

    // Pattern for HTML title="..."
    const htmlRegex = new RegExp(`title="(${datePattern}[^"]+)"`, 'g');
    while ((match = htmlRegex.exec(htmlContent)) !== null) {
        titles.add(match[1]);
    }

    return Array.from(titles).sort(); // Sort to keep order if possible, but we'll map by index usually
}

function main() {
    // 1. Process Audio Data
    const audioContent = `const audioData = ${JSON.stringify(audioLinks, null, 4)};`;
    fs.writeFileSync(audioDataFile, audioContent);
    console.log('Audio data written.');

    // 2. Process Video Data
    let p1Titles = [];
    let p2Titles = [];

    if (fs.existsSync(playlist1File)) {
        const content = fs.readFileSync(playlist1File, 'utf8');
        // Playlist 1 pattern: 20xx.xx.xx (e.g. 2013.02.10)
        // Regex: 20\\d{2}\\.\\d{2}\\.\\d{2}
        p1Titles = extractTitles(content, '20\\d{2}\\.\\d{2}\\.\\d{2}');
        console.log(`Found ${p1Titles.length} titles in Playlist 1`);
    }

    if (fs.existsSync(playlist2File)) {
        const content = fs.readFileSync(playlist2File, 'utf8');
        // Playlist 2 pattern: 20xx0x0x (e.g. 20200509)
        // Regex: 20\\d{6}
        p2Titles = extractTitles(content, '20\\d{6}');
        console.log(`Found ${p2Titles.length} titles in Playlist 2`);
    }

    // Construct the final videoData array
    const videoData = [];

    // Playlist 1: 32 videos expected
    const p1Id = 'PL1Ic3ZIKnbkVz4HlaiafZM_0k5Mr7pWdq';
    // We need to ensure we map them correctly. 
    // Since Set extraction loses order relative to the playlist index, 
    // but the extracted list might be sorted by date if we sort(), 
    // however, the playlist order is what matters for the 'index' param.
    // 
    // Ideally, we should extract them *in order of appearance* in the HTML.
    // But the HTML structure is complex.
    //
    // Let's refine the extraction to be an ordered list based on appearance.
    // We'll use a single regex pass and capture them in order.
    
    function extractOrderedTitles(content, pattern) {
        const regex = new RegExp(`"text":"(${pattern}[^"]+)"`, 'g');
        const matches = [];
        let m;
        while ((m = regex.exec(content)) !== null) {
            // Filter out short duplicates or navigational elements if any
            // The titles are usually long.
            if (m[1].length > 15) {
                matches.push(m[1]);
            }
        }
        // Remove exact consecutive duplicates which often happen in YouTube JSON (renderer vs navigation endpoint)
        return matches.filter((item, pos, ary) => !pos || item != ary[pos - 1]);
    }
    
    // Re-extract with order
    if (fs.existsSync(playlist1File)) {
        const content = fs.readFileSync(playlist1File, 'utf8');
        p1Titles = extractOrderedTitles(content, '20\\d{2}\\.\\d{2}\\.\\d{2}');
        // Remove duplicates more aggressively (using Set for uniqueness might be safer if the playlist order is not strict by date)
        // But the user wants the playlist order.
        // YouTube JSON usually lists them in order.
        // We'll take the first 32 unique titles found.
        p1Titles = [...new Set(p1Titles)]; 
    }

    if (fs.existsSync(playlist2File)) {
        const content = fs.readFileSync(playlist2File, 'utf8');
        p2Titles = extractOrderedTitles(content, '20\\d{6}');
        p2Titles = [...new Set(p2Titles)];
    }

    // Fill P1 (Target 32)
    for (let i = 0; i < 32; i++) {
        videoData.push({
            playlistId: p1Id,
            index: i + 1,
            title: p1Titles[i] || `佛陀讲堂 Video ${i + 1}`
        });
    }

    // Fill P2 (Target 56)
    const p2Id = 'PLwpcy7rhx5LHaH2f8yf9me8HRyUjWvP-S';
    for (let i = 0; i < 56; i++) {
        videoData.push({
            playlistId: p2Id,
            index: i + 1,
            title: p2Titles[i] || `谛深大师直播 Episode ${i + 1}`
        });
    }

    const videoContent = `const videoData = ${JSON.stringify(videoData, null, 4)};`;
    fs.writeFileSync(videoDataFile, videoContent);
    console.log('Video data written.');
}

main();
