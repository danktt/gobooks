package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/kkdai/youtube/v2"
	"github.com/rs/cors"
)

func findFormatByQuality(formats youtube.FormatList, quality string) *youtube.Format {
	for _, format := range formats {
		if format.QualityLabel == quality {
			return &format
		}
	}
	return nil
}

func downloadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	videoURL := r.URL.Query().Get("url")
	if videoURL == "" {
		http.Error(w, "Missing video URL", http.StatusBadRequest)
		return
	}

	client := youtube.Client{}

	video, err := client.GetVideo(videoURL)
	if err != nil {
		http.Error(w, "Failed to get video info: "+err.Error(), http.StatusInternalServerError)
		return
	}

	formats := video.Formats.WithAudioChannels()
	format := findFormatByQuality(formats, "1080p")
	if format == nil {
		format = findFormatByQuality(formats, "720p")
	}
	if format == nil {
		format = findFormatByQuality(formats, "480p")
	}
	if format == nil && len(formats) > 0 {
		format = &formats[0]
	}

	stream, _, err := client.GetStream(video, format)
	if err != nil {
		http.Error(w, "Failed to get video stream: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer stream.Close()

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.mp4", video.Title))
	w.Header().Set("Content-Type", "video/mp4")

	_, err = io.Copy(w, stream)
	if err != nil {
		http.Error(w, "Failed to stream video: "+err.Error(), http.StatusInternalServerError)
		return
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/download", downloadHandler)

	// Create a new CORS handler
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3003"}, // Allow requests from your frontend
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Wrap your mux with the CORS handler
	handler := c.Handler(mux)

	fmt.Println("Server is running on http://localhost:8080")
	err := http.ListenAndServe(":8080", handler)
	if err != nil {
		fmt.Printf("Failed to start server: %s\n", err)
		os.Exit(1)
	}
}
