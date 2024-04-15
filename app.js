const express = require("express");
const app = express();
const path = require("path");
const mongoClient = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
console.log(path.join(__dirname, "public"));

console.log(path.join(__dirname, "views"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoClient
    .connect("mongodb://127.0.0.1:27017/YoutubeLink2")
    .then(() => {
        console.log("DB is connected");
    })
    .catch(() => {
        console.log("DB is not connected");
    });

const YtSchema = new mongoClient.Schema({
    Link: {
        type: String,
        required: true,
    },
});

const YTLinkModel = mongoClient.model("YTLink", YtSchema);

app.get("/", async (req, res) => {
    let videoId = "ePwiT-RH2NY";

    const lastInsertedDocument = await YTLinkModel.findOne()
        .sort({ _id: -1 })
        .limit(1);

    if (lastInsertedDocument) {
        videoId = lastInsertedDocument.Link;
        res.render("index", { videoId });
    } else {
        res.render("index", { videoId });
    }
});

app.post("/submit", async (req, res) => {
    const videoLink = req.body.videoLink;
    // Extract video ID from YouTube link
    const videoId = extractVideoId(videoLink);
    console.log(videoId);
    const linkky = await YTLinkModel.create({
        Link: videoId,
    });
    await linkky.save();
    res.render("index", { videoId });
});

function extractVideoId(url) {
    const match = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return (match && match[1]) || null;
}

app.listen(3000, () => {
    console.log("Server is Running");
});
