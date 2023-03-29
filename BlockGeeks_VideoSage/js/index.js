const transcriptBox = document.getElementById("transcript_box");
const submitBtn = document.getElementById("submit_btn");

submitBtn.addEventListener("click", () => {
  const videoUrl = document.getElementById("video_url").value;

  if (!videoUrl) {
    transcriptBox.value = "Please enter a valid YouTube video URL";
    return;
  }

  const videoId = getVideoId(videoUrl);

  if (!videoId) {
    transcriptBox.value = "Please enter a valid YouTube video URL";
    return;
  }

  const videoElement = document.getElementById("video");
  videoElement.setAttribute(
    "src",
    `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`
  );
  videoElement.setAttribute("crossorigin", "anonymous");

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    transcriptBox.value = "";
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    transcriptBox.value = finalTranscript;
  };

  recognition.onerror = (event) => {
    console.error(event.error);
    transcriptBox.value = "Error transcribing speech";
  };

  recognition.onend = () => {
    console.log("Speech recognition ended");
  };

  videoElement.addEventListener("playing", () => {
    recognition.start();
  });

  videoElement.addEventListener("pause", () => {
    recognition.stop();
  });
});

function getVideoId(url) {
  const videoIdRegex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|&|$)/;
  const match = url.match(videoIdRegex);
  return match ? match[1] : null;
}
