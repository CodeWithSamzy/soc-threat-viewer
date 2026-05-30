import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'

  try {
    const res = await fetch(
      `https://otx.alienvault.com/api/v1/pulses/subscribed?page=${page}&limit=20`,
      {
        headers: {
          'X-OTX-API-KEY': process.env.OTX_API_KEY!,
        },
        next: { revalidate: 300 },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from OTX' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}