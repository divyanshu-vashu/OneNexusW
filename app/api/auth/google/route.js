import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, image, accessToken } = await request.json();
    
    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. If not, create a new user
    // 3. Return the user data or appropriate response

    // For now, just return the received data
    return NextResponse.json({ 
      success: true, 
      user: { 
        name, 
        email,
        image,
        accessToken
      } 
    });
  } catch (error) {
    console.error('Error in Google auth callback:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}