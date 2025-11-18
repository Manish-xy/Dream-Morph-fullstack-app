export const uploadToCloudinary = async (
  imageUrl: string,
  folder: string = "generated"
): Promise<string> => {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create FormData
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "dream_morph_upload");
    formData.append("folder", folder);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/dketx57te/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to Cloudinary");
    }

    const data = await uploadResponse.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
