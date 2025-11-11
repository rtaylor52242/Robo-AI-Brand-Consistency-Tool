
import { GoogleGenAI, Type } from '@google/genai';
import { BusinessDNA, CampaignIdea, Creative } from '../types';

// This is a placeholder. In a real app, this would be a secure environment variable.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // A real app would have more robust error handling or a login flow.
  console.warn("API_KEY is not set. Using a mock response for Gemini calls.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const businessDnaSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the business." },
        tagline: { type: Type.STRING, description: "A catchy tagline for the business." },
        tone: { type: Type.STRING, description: "The brand's tone of voice (e.g., 'Playful, modern, and friendly')." },
        colors: {
            type: Type.ARRAY,
            description: "An array of 4 primary brand colors in hex format (e.g., '#FFFFFF').",
            items: { type: Type.STRING }
        },
        logoDescription: { type: Type.STRING, description: "A detailed description for a visually appealing logo. E.g. 'a minimalist line art of a coffee cup with a mountain range inside'."},
        imageDescriptions: {
            type: Type.ARRAY,
            description: "An array of 5 detailed descriptions for brand images that are visually appealing and relevant to the brand.",
            items: { type: Type.STRING }
        }
    },
    required: ['name', 'tagline', 'tone', 'colors', 'logoDescription', 'imageDescriptions']
};

export const generateBusinessDna = async (websiteUrl: string): Promise<BusinessDNA> => {
   if (!API_KEY) {
      console.log(`Simulating scan for: ${websiteUrl}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: "Wanderlust Coffee Co.",
            websiteUrl: websiteUrl,
            logoUrl: 'https://i.imgur.com/sPEkdEg.png',
            images: [
              'https://picsum.photos/id/1060/400/400',
              'https://picsum.photos/id/225/400/400',
              'https://picsum.photos/id/1025/400/400',
              'https://picsum.photos/id/1080/400/400',
              'https://picsum.photos/id/200/400/400',
            ],
            colors: ["#362222", "#F5F1ED", "#A38560", "#EFEFEF"],
            tagline: "Your adventure in a cup.",
            tone: "Adventurous, warm, and artisanal",
          });
        }, 1500);
      });
  }

  // Step 1: Generate textual brand identity and image descriptions
  const dnaPrompt = `
    You are a branding expert. A company with the website "${websiteUrl}" needs a brand identity.
    Based on the domain name and potential business type, create a comprehensive brand profile.
    For example, if the URL is "wanderlust-coffee.com", you'd infer it's a coffee brand focused on travel and adventure.
    If the URL is generic like "example.com", create a fictional but plausible tech startup brand called "Nexus Innovations".
    Generate the brand profile.
  `;
    
  const dnaResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: dnaPrompt,
      config: {
          responseMimeType: 'application/json',
          responseSchema: businessDnaSchema,
      },
  });

  const dnaJson = JSON.parse(dnaResponse.text);

  // Step 2: Generate Logo
  const logoPrompt = `
    Create a high-quality, professional logo based on this description: "${dnaJson.logoDescription}".
    The logo should be on a clean, solid color background.
    Style: modern, vector, flat icon.
  `;
  const logoResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: logoPrompt,
      config: {
          numberOfImages: 1,
          aspectRatio: '1:1',
          outputMimeType: 'image/png'
      }
  });
  const logoUrl = `data:image/png;base64,${logoResponse.generatedImages[0].image.imageBytes}`;

  // Step 3: Generate Brand Imagery
  const imagePromises = dnaJson.imageDescriptions.map((desc: string) => {
      const imagePrompt = `
          Create a stunning, high-quality promotional image for a marketing campaign.
          Image theme: "${desc}"
          Brand Tone: ${dnaJson.tone}
          Visual Style:
          - The image should be visually appealing, professional, and align with an "${dnaJson.tone}" aesthetic.
          - Dominant colors should be inspired by this palette: ${dnaJson.colors.join(', ')}.
          - Photography should be clean, modern, and high-resolution.
          - Do NOT include any text or logos in the image itself. The image should be a clean background visual.
      `;
      return ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: imagePrompt,
          config: {
              numberOfImages: 1,
              aspectRatio: '1:1',
              outputMimeType: 'image/jpeg',
          }
      });
  });

  const imageResponses = await Promise.all(imagePromises);
  const images = imageResponses.map(res => `data:image/jpeg;base64,${res.generatedImages[0].image.imageBytes}`);

  return {
      name: dnaJson.name,
      websiteUrl,
      logoUrl,
      images,
      colors: dnaJson.colors,
      tagline: dnaJson.tagline,
      tone: dnaJson.tone,
  };
};

/**
 * Generates campaign ideas using the Gemini API based on the Business DNA.
 */
export const generateCampaignIdeas = async (dna: BusinessDNA): Promise<CampaignIdea[]> => {
  if (!API_KEY) return Promise.resolve([
      { headline: "Escape the 9-to-5", description: "A campaign focused on remote work and finding your passion with our coffee." },
      { headline: "Artisan's Choice", description: "Highlighting the quality and craft behind our single-origin beans." },
      { headline: "Black Friday Fuel", description: "A special promotion to power through the holiday shopping season." },
    ]);
  
  const prompt = `
    You are a marketing strategist for a company with the following brand identity:
    - Name: ${dna.name}
    - Tagline: ${dna.tagline}
    - Tone/Voice: ${dna.tone}
    
    Generate 3 distinct and creative marketing campaign ideas. For each campaign, provide a catchy headline and a brief 1-2 sentence description of the campaign's goal.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ['headline', 'description'],
        },
      },
    },
  });
  
  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

/**
 * Generates a single visual creative using the Imagen model.
 */
export const generateCreative = async (
  campaign: CampaignIdea,
  dna: BusinessDNA,
  size: 'Square' | 'Story' | 'Banner'
): Promise<Creative> => {
   if (!API_KEY) return Promise.resolve({
        id: crypto.randomUUID(),
        imageUrl: `https://picsum.photos/seed/${crypto.randomUUID()}/600/600`,
        headline: campaign.headline,
        sizePreset: size,
   });
  
  const aspectRatioMap = {
    Square: '1:1',
    Story: '9:16',
    Banner: '16:9',
  };

  const prompt = `
    Create a stunning, high-quality promotional image for a marketing campaign.
    
    Campaign Headline: "${campaign.headline}"
    Brand Name: ${dna.name}
    Brand Tone: ${dna.tone}
    
    Visual Style:
    - The image should be visually appealing, professional, and align with an "${dna.tone}" aesthetic.
    - Dominant colors should be inspired by this palette: ${dna.colors.join(', ')}.
    - Photography should be clean, modern, and high-resolution.
    
    Image Content:
    - Based on the headline "${campaign.headline}", create a compelling scene. For example, for a coffee company, an image could be of a steaming mug of coffee on a rustic wooden table with a map and compass nearby.
    - Do NOT include any text or logos in the image itself. The image should be a clean background visual.
  `;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: aspectRatioMap[size],
      outputMimeType: 'image/jpeg',
    },
  });

  const base64ImageBytes = response.generatedImages[0].image.imageBytes;
  const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

  return {
    id: crypto.randomUUID(),
    imageUrl,
    headline: campaign.headline,
    sizePreset: size,
  };
};
