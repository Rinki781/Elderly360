import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = 'doctor_summary',
      language = 'en',
      seniorName = 'Ramesh Sharma',
      age = 72,
      conditions = ['Hypertension', 'Type 2 Diabetes', 'Osteoarthritis'],
      continuityScore = 76,
      scoreChange = -14,
      driftAlerts = ['Evening Atorvastatin & Metformin completion dropped from 92% to 35%'],
      missedDoses = ['Atorvastatin 10mg (Bedtime)', 'Metformin 500mg (Evening)'],
      vitals = 'BP 144/88 mmHg (slightly elevated), Pulse 74 bpm',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Deterministic fallback templates in case GEMINI_API_KEY is not set or network fails
    const fallbackEnglishDoctorSummary = {
      summaryTitle: `Clinical Pre-Visit Care Continuity Summary: ${seniorName} (${age}y)`,
      period: 'Past 30 Days Pre-Consultation Window',
      clinicalOverview: `${seniorName} has maintained stable morning medication adherence (95%), but experienced significant routine drift during evening hours over the past 6 days. Care Continuity Score declined by ${Math.abs(
        scoreChange
      )} points (now ${continuityScore}/100).`,
      keyObservedChanges: [
        'Evening routine drift: Missed 4 of the last 6 evening doses of Metformin and Atorvastatin.',
        'Mild elevation in resting Blood Pressure (observed at 144/88 mmHg vs 132/82 baseline).',
        'Morning 20-min routine garden walk skipped twice due to reported right knee soreness.',
        'Refill warning: Calcium Carbonate + Vitamin D3 is running low (4 days of stock remaining).',
      ],
      suggestedQuestionsForDoctor: [
        'Would shifting the evening Atorvastatin/Metformin dose timing or simplifying to a morning combination pill reduce evening forgetfulness?',
        'Does the recent blood pressure rise (144/88 mmHg) require dosage titration of Telmisartan 40mg, or is it secondary to missed evening doses?',
        'What low-impact physical therapy exercises can alleviate knee discomfort without stopping daily walking routines?',
        'Is it time to repeat the HbA1c test and comprehensive lipid profile during this quarterly visit?',
      ],
      patientGuidance:
        'Please bring all current pill bottles and blood sugar self-monitoring logs to the consultation.',
      weeklyCareSummary:
        'Overall weekly continuity score is 76/100. Family attention is advised for evening medication reminders between 8:00 PM and 9:00 PM.',
      generatedBy: 'ELDERLY360 Clinical Intelligence Engine (Deterministic Template)',
    };

    const fallbackHindiDoctorSummary = {
      summaryTitle: `डॉक्टर परामर्श सारांश: ${seniorName} (उम्र ${age} वर्ष)`,
      period: 'पिछले 30 दिनों का केयर रिकॉर्ड',
      clinicalOverview: `${seniorName} सुबह की दवाइयां नियमित रूप से (95%) ले रहे हैं, लेकिन पिछले 6 दिनों में शाम की दवाइयों में गिरावट देखी गई है। केयर कंटिन्यूटी स्कोर ${Math.abs(
        scoreChange
      )} अंक घटकर ${continuityScore}/100 रह गया है।`,
      keyObservedChanges: [
        'शाम की दवाइयों में रुकावट: पिछले 6 में से 4 दिन मेटफॉर्मिन और एटोरवास्टेटिन की खुराक छूट गई।',
        'रक्तचाप में हल्की वृद्धि देखी गई (144/88 mmHg, जो सामान्य से थोड़ा अधिक है)।',
        'घुटने में दर्द के कारण 2 दिन सुबह की 20 मिनट की सैर छूट गई।',
        'कैल्शियम और विटामिन D3 की केवल 4 दिनों की गोलियां शेष हैं।',
      ],
      suggestedQuestionsForDoctor: [
        'क्या शाम की दवाइयों का समय बदलकर सुबह किया जा सकता है ताकि शाम को भूलने की समस्या न हो?',
        'क्या हालिया बढ़ा हुआ बीपी (144/88) छूटी हुई दवाइयों के कारण है या डोज बदलने की जरूरत है?',
        'घुटने के दर्द के लिए कौन से हल्के व्यायाम किए जा सकते हैं ताकि टहलना जारी रह सके?',
        'क्या इस तिमाही जांच में HbA1c और लिपिड प्रोफाइल टेस्ट दोबारा करवाने चाहिए?',
      ],
      patientGuidance: 'कृपया परामर्श के समय अपनी वर्तमान सभी दवाइयाँ साथ लेकर जाएँ।',
      weeklyCareSummary:
        'साप्ताहिक स्कोर 76/100 है। परिवार के सदस्यों को शाम 8 से 9 बजे के बीच दवा याद दिलाने में मदद करने की सलाह दी जाती है।',
      generatedBy: 'एल्डर्ली360 क्लिनिकल इंटेलिजेंस इंजन (निर्धारित टेम्पलेट)',
    };

    const chosenFallback =
      language === 'hi' ? fallbackHindiDoctorSummary : fallbackEnglishDoctorSummary;

    // If API key is present, attempt live call to Gemini API
    if (apiKey) {
      try {
        const prompt = `
You are ELDERLY360's geriatric care AI. Analyze this 30-day care continuity record and generate a structured JSON summary for the senior's upcoming doctor visit.
Language: ${language === 'hi' ? 'Hindi' : 'English'}
Senior Name: ${seniorName}, Age: ${age}
Chronic Conditions: ${conditions.join(', ')}
Care Continuity Score: ${continuityScore}/100 (Change: ${scoreChange} points in last 7 days)
Routine Drift Alerts: ${driftAlerts.join('; ')}
Missed Doses: ${missedDoses.join('; ')}
Vitals: ${vitals}

Return ONLY valid JSON matching this schema:
{
  "summaryTitle": string,
  "period": string,
  "clinicalOverview": string,
  "keyObservedChanges": string[],
  "suggestedQuestionsForDoctor": string[],
  "patientGuidance": string,
  "weeklyCareSummary": string,
  "generatedBy": "Gemini 1.5 Pro / Flash via ELDERLY360"
}
`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return NextResponse.json({ success: true, data: parsed, isFallback: false });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, using deterministic template:', err);
      }
    }

    // Graceful deterministic fallback
    return NextResponse.json({
      success: true,
      data: chosenFallback,
      isFallback: true,
      note: apiKey ? 'Fallback used due to API failure' : 'Deterministic template used (GEMINI_API_KEY optional)',
    });
  } catch (error) {
    console.error('Error in /api/gemini:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process care summary request',
      },
      { status: 500 }
    );
  }
}
