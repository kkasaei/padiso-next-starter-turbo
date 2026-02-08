import { NextRequest, NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      )
    }

    // Validate slug format
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format" },
        { status: 400 }
      )
    }

    const clerk = await clerkClient()

    // Try to get organization by slug
    try {
      const orgs = await clerk.organizations.getOrganizationList({
        limit: 100,
      })

      // Check if any organization has this slug
      const slugTaken = orgs.data.some(org => org.slug === slug)

      return NextResponse.json({
        available: !slugTaken,
        slug,
      })
    } catch (error) {
      console.error("Error checking slug availability:", error)
      return NextResponse.json(
        { error: "Failed to check slug availability" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Unexpected error in check-slug API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
