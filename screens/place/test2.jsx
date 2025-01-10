const handleSubmit = async () => {
    try {
        setIsLoading(true);
        setSubmissionError('');

        // Validation logic here...

        const storedMerchantId = await AsyncStorage.getItem('merchantId');
        const token = await AsyncStorage.getItem('accessToken');

        // Prepare the payload
        const payload = {
            name: formData.name.trim(),
            location: {
                state: formData.location.split(',')[0].trim(),
                country: formData.location.split(',')[1].trim(),
            },
            openingHour: formData.openingHour,
            closingHour: formData.closingHour,
            description: formData.description?.trim() || '',
            categoryId: formData.categoryId,
            locationImages: [], // For new image URLs
            locationImagesIds: [], // For existing image IDs
            changeLocationImage: true, // Set to true if changing images
        };

        // Retrieve existing image IDs
        if (placeDetails.locationImages) {
            payload.locationImagesIds = placeDetails.locationImages.map(image => image.id);
        }

        // Upload new images and filter out existing ones
        for (const imageUri of formData.locationImages) {
            if (imageUri && !payload.locationImagesIds.includes(imageUri.id)) { // Check if the image is new
                const imageUrl = await uploadImage(imageUri, token);
                payload.locationImages.push(imageUrl); // Add new image URL
            }
        }

        // Adjust changeLocationImage flag
        if (payload.locationImages.length === 0) {
            payload.changeLocationImage = false; // No new images to change
        }

        // Make the update request
        const response = await api.patch(
            `/merchants/${storedMerchantId}/places/${placeDetails?.id}`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Handle response...

    } catch (error) {
        // Error handling...
    }
};