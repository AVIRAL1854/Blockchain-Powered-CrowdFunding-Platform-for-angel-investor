import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){


    const body=await req.json();
    
    console.log(JSON.stringify(body));

    return NextResponse.json({
        data:body
    })
}