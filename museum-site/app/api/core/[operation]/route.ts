import { apiJson, requireApiIdentity, sameOriginWrite } from "@/lib/api-guards";
import { coreDependencies, unavailableCoreCapability } from "@/lib/core-contract";
import { CoreReadError, readCoreCatalog, readCoreCollection, readCoreIdentity, readCorePrices } from "@/lib/core-client";
import { corePublicReads, CorePublicBusy } from "@/lib/core-public-cache";
import { relayCorePublicModel } from "@/lib/core-model-relay";

export async function GET(request: Request, { params }: { params: Promise<{ operation: string }> }) {
  const { operation } = await params;
  try {
    if (operation === "model") return await relayCorePublicModel(new URL(request.url).searchParams.get("id") ?? "", request.signal);
    if (operation === "catalog") return apiJson(await corePublicReads.read("catalog", () => readCoreCatalog(), 20000));
    if (operation === "collection") {
      const slug = new URL(request.url).searchParams.get("slug") ?? "";
      if (!/^[a-zA-Z0-9_-]{1,120}$/.test(slug)) throw new CoreReadError("INVALID_CORE_SLUG", 400);
      return apiJson(await corePublicReads.read(`collection:${slug}`, () => readCoreCollection(slug), 15000));
    }
    // Prices share only an in-flight request. No retained or expired price is used.
    if (operation === "prices") return apiJson(await corePublicReads.read("prices", () => readCorePrices(), 0));
    if (operation === "identity") return apiJson(await readCoreIdentity(request.headers.get("authorization")));
    if ((coreDependencies as readonly string[]).includes(operation)) return apiJson({ error: "CORE_DEPENDENCY_REQUIRED", ...unavailableCoreCapability(operation) }, 503);
    return apiJson({ error: "UNKNOWN_CORE_CAPABILITY" }, 404);
  } catch (error) {
    const failure = error instanceof CoreReadError || error instanceof CorePublicBusy ? error : new CoreReadError("CORE_UNAVAILABLE");
    return apiJson({ error: failure.code, status: failure.code, available: false, source_of_truth: "MERGE_CORE" }, failure.status);
  }
}

export async function POST(request: Request) {
  if (!await requireApiIdentity()) return apiJson({ error: "AUTH_REQUIRED" }, 401);
  if (!sameOriginWrite(request)) return apiJson({ error: "ORIGIN_REJECTED" }, 403);
  // No guessed endpoint or locally trusted verification may cross this boundary.
  // Connect only after the current production CORE contract and identity mapping
  // are verified. Browser flags and draft data are never evidence.
  return apiJson({ error: "CORE_NOT_CONNECTED", status: "NOT_YET_IMPLEMENTED", order_created: false, payment_verified: false, production_authorized: false, model_generated: false, passport_verified: false }, 503);
}
