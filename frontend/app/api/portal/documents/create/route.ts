import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const keywords = String(formData.get("keywords") ?? "").trim();
  const fileName = String(formData.get("file_name") ?? "").trim();
  const mimeType = String(formData.get("mime_type") ?? "").trim();
  const fileSizeRaw = Number(formData.get("file_size") ?? "0");
  const fileContent = String(formData.get("file_content") ?? "").trim();
  const fileSize = Number.isFinite(fileSizeRaw) ? Math.max(1, fileSizeRaw) : 1;

  if (!title || !category || !fileName || !mimeType || !fileContent) {
    return NextResponse.redirect(new URL("/portal/documents?error=1", request.url));
  }

  try {
    const uploadUrlResponse = await fetch(`${API_URL}/documents/upload-url/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_name: fileName,
        mime_type: mimeType,
        file_size: fileSize,
      }),
      cache: "no-store",
    });

    if (!uploadUrlResponse.ok) {
      return NextResponse.redirect(new URL("/portal/documents?error=1", request.url));
    }

    const uploadPayload = (await uploadUrlResponse.json()) as {
      upload_url: string;
      file_url: string;
    };

    const uploadResponse = await fetch(uploadPayload.upload_url, {
      method: "PUT",
      headers: { "Content-Type": mimeType },
      body: fileContent,
      cache: "no-store",
    });

    if (!uploadResponse.ok) {
      return NextResponse.redirect(new URL("/portal/documents?error=1", request.url));
    }

    const metadataResponse = await fetch(`${API_URL}/documents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        keywords,
        file_url: uploadPayload.file_url,
        file_name: fileName,
        mime_type: mimeType,
        file_size: fileSize,
      }),
      cache: "no-store",
    });

    if (!metadataResponse.ok) {
      return NextResponse.redirect(new URL("/portal/documents?error=1", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/portal/documents?error=1", request.url));
  }

  return NextResponse.redirect(new URL("/portal/documents?created=1", request.url));
}
