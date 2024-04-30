import axios from "axios";
import "dotenv/config";
import nullthrows from "nullthrows";

const AZURE_KEY = process.env.AZURE_KEY;

export const azure = {
  translate: async (text: string, fromLang: string, toLang: string) => {
    try {
      const response = await axios.request({
        baseURL: "https://api.cognitive.microsofttranslator.com",
        url: "/translate",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY,
          "Ocp-Apim-Subscription-Region": "westus2",
          "Content-type": "application/json",
          "X-ClientTraceId": crypto.randomUUID(),
        },
        params: {
          "api-version": "3.0",
          from: fromLang,
          to: toLang,
        },
        data: [
          {
            text,
          },
        ],
        responseType: "json",
      });

      return nullthrows(response.data[0].translations[0].text) as string;
    } catch {
      return null;
    }
  },

  detectLang: async (text: string) => {
    const response = await axios.request({
      baseURL: "https://api.cognitive.microsofttranslator.com",
      url: "/detect",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Ocp-Apim-Subscription-Region": "westus2",
        "Content-type": "application/json",
        "X-ClientTraceId": crypto.randomUUID(),
      },
      params: {
        "api-version": "3.0",
      },
      data: [
        {
          text,
        },
      ],
      responseType: "json",
    });

    if (response.data.length > 0 && response.data[0].score >= 0.5) {
      return response.data[0].language as string;
    } else {
      return null;
    }
  },
};
