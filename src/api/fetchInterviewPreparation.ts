// /projects/{project_id}/interview-preparation にPOSTするAPI関数
export interface InterviewPreparationResponse {
  interviewee: string;
  questions: string;
}

export async function fetchInterviewPreparation(
  projectId: string,
  sel: 'CPF' | 'PSF'
): Promise<InterviewPreparationResponse | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/interview-preparation?sel=${sel}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('インタビュー項目生成APIのレスポンスが正常ではありません:', response.status);
      return null;
    }
  } catch (error) {
    console.error('インタビュー項目生成APIの呼び出しに失敗しました:', error);
    return null;
  }
}
