// Business type images mapping
export const businessTypeImages: Record<string, string> = {
  restaurant:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  bar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  hotel:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  store:
    "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  salon:
    "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  default:
    "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
};

export const getBusinessImage = (type: string): string => {
  const lowerType = type.toLowerCase();

  for (const [key, url] of Object.entries(businessTypeImages)) {
    if (lowerType.includes(key)) {
      return url;
    }
  }

  return businessTypeImages.default;
};
