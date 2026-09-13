-- CreateTable
CREATE TABLE "MarginalPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "articleSlug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'comment',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "MarginalPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarginalReply" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "MarginalReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MarginalPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MarginalReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MarginalReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "reporterId" TEXT,
    "reporterEmail" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "MarginalReport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MarginalPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MarginalReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "MarginalPost_articleSlug_status_createdAt_idx" ON "MarginalPost"("articleSlug", "status", "createdAt");

-- CreateIndex
CREATE INDEX "MarginalPost_status_createdAt_idx" ON "MarginalPost"("status", "createdAt");

-- CreateIndex
CREATE INDEX "MarginalPost_guestEmail_idx" ON "MarginalPost"("guestEmail");

-- CreateIndex
CREATE INDEX "MarginalReply_postId_status_createdAt_idx" ON "MarginalReply"("postId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "MarginalReport_postId_resolvedAt_idx" ON "MarginalReport"("postId", "resolvedAt");
