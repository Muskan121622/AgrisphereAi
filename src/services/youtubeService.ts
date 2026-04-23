import axios from "axios";
import { Video } from "../types/advisory";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const FARMING_QUERIES_EN = [
    "Indian farming techniques organic kisan",
    "Smart agriculture India technology guide",
    "Successful organic farming stories India",
    "Modern dairy farming india tips",
    "Hydroponics farming at home India",
    "Vegetable farming profit India",
    "Tractor farming equipment India reviews",
    "Sustainable agriculture methods India"
];

const FARMING_QUERIES_HI = [
    "आधुनिक खेती के तरीके",
    "जैविक खेती कैसे करें",
    "भारतीय किसान सफलता की कहानियां",
    "डेयरी फार्मिंग की जानकारी",
    "सब्जी की खेती से मुनाफा",
    "कृषि यंत्र की जानकारी",
    "टपक सिंचाई प्रणाली",
    "मशरूम की खेती"
];

const FARMING_QUERIES_TE = [
    "ఆధునిక వ్యవసాయ పద్ధతులు లాభాలు",
    "సేంద్రీయ వ్యవసాయం ఎలా చేయాలి లాభాలు",
    "తెలుగు రాష్ట్రాల్లో పాడి పరిశ్రమ లాభాలు",
    "కూరగాయల సాగు పద్ధతులు మరియు సూచనలు",
    "వ్యవసాయ పరికరాలు మరియు వాటి ఉపయోగాలు",
    "డ్రిప్ ఇరిగేషన్ పద్ధతులు లాభాలు",
    "తెలుగు రైతుల విజయ గాథలు",
    "ట్రాక్టర్ తో వ్యవసాయం లాభాలు"
];

const FARMING_QUERIES_MR = [
    "आधुनिक शेती तंत्रज्ञान फायदे",
    "सेंद्रिय शेती कशी करावी नफा",
    "दुग्धव्यवसाय माहिती आणि फायदे",
    "भाजीपाला लागवड तंत्रज्ञान नफा",
    "शेती अवजारे आधुनिक पद्धती",
    "ठिबक सिंचन पद्धतीचे फायदे",
    "यशस्वी शेतकऱ्यांच्या यशोगाथा",
    "ऊस लागवड आधुनिक पद्धत"
];

const FARMING_QUERIES_OR = [
    "ଆଧୁନିକ କୃଷି ପ୍ରଣାଳୀ ଲାଭ",
    "ଜୈବିକ କୃଷି କିପରି କରିବେ",
    "ଦୁଗ୍ଧ ଫାର୍ମିଙ୍ଗ ଲାଭ ଆୟ",
    "ପନିପରିବା ଚାଷ ପ୍ରଣାଳୀ ଏବଂ ଲାଭ",
    "କୃଷି ଯନ୍ତ୍ରପାତି ବ୍ୟବହାର",
    "ବୁନ୍ଦା ଜଳସେଚନ ପ୍ରଣାଳୀ ଲାଭ",
    "ସଫଳ କୃଷକଙ୍କ କାହାଣୀ",
    "ଟ୍ରାକ୍ଟର ସହିତ ଚାଷ ଲାଭ"
];

const mapLanguageToQueries = (lang: string) => {
    switch(lang) {
        case "Hindi": return FARMING_QUERIES_HI;
        case "Telugu": return FARMING_QUERIES_TE;
        case "Marathi": return FARMING_QUERIES_MR;
        case "Odia": return FARMING_QUERIES_OR;
        default: return FARMING_QUERIES_EN;
    }
};

const mapLanguageToCode = (lang: string) => {
    switch(lang) {
        case "Hindi": return "hi";
        case "Telugu": return "te";
        case "Marathi": return "mr";
        case "Odia": return "or";
        default: return "en";
    }
};

interface YouTubeVideoItem {
    id: { videoId: string };
    snippet: {
        title: string;
        thumbnails: { medium: { url: string } };
        channelTitle: string;
        publishedAt: string;
    };
}

// Returns tuple of [videos, nextPageToken]
export const fetchFarmingVideos = async (language: string, pageToken?: string, searchQuery?: string): Promise<{ videos: Video[], nextPageToken?: string }> => {
    if (!YOUTUBE_API_KEY) {
        console.error("YouTube API Key is missing!");
        return { videos: [] };
    }

    try {
        let q = searchQuery;
        if (!q) {
            const queryList = mapLanguageToQueries(language);
            // Pick a random query to ensure fresh content on reload
            q = queryList[Math.floor(Math.random() * queryList.length)];
        }

        console.log(`Fetching YouTube videos for language: ${language}, query: ${q}`);

        const response = await axios.get(BASE_URL, {
            params: {
                part: "snippet",
                q: q,
                type: "video",
                videoDuration: "medium", // Filter out Shorts (which are < 1 min)
                maxResults: 6,
                regionCode: "IN",
                relevanceLanguage: mapLanguageToCode(language),
                key: YOUTUBE_API_KEY,
                pageToken: pageToken
            },
        });

        const videos: Video[] = response.data.items.map((item: YouTubeVideoItem) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));

        return { videos, nextPageToken: response.data.nextPageToken };

    } catch (error: any) {
        console.error("Error fetching videos:", error);
        if (error.response) {
            console.error("YouTube API Error Details:", error.response.data);
            if (error.response.status === 403) {
                console.error("Access Forbidden. Likely Quota Exceeded or API Key restriction.");
            }
        }
        return { videos: [] };
    }
};
