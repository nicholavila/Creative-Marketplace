import type { ProductState, ProductType } from "../types/product.type";
import type { BadgeVariant } from "@/components/ui/badge";

export const PRODUCT_TYPE_DISPLAY_TEXT: Record<ProductType, string> = {
  "ui-kits": "UI Kits",
  "dashboard-wireframes": "Dashboard / Wireframes",
  "themes-spas": "Themes / SPAs",
  plugins: "Plugins",
  "icon-sets-brushes-actions": "Icon Sets / Brushes / Actions",
  fonts: "Fonts",
  "mockups-posters": "Mockups / Posters",
  "scaffolding-starters": "Scaffolding / Starters",
  "3d-assets": "3D Assets",
  illustrations: "Illustrations",
  "documents-page-templates": "Documents / Page Templates",
  spreadsheets: "Spreadsheets",
  photos: "Photos",
  video: "Video",
  "audio-sound-effects": "Audio / Sound Effects"
};

export const PRODUCT_STATE_BADGE_VARIANT_ADMIN: Record<
  ProductState,
  BadgeVariant
> = {
  created: "secondary",
  updated: "secondary",
  submitted: "default",
  resubmitted: "default",
  approved: "success",
  rejected: "destructive",
  applied: "default",
  published: "success",
  "withdrawn-applied": "destructive",
  "withdrawn-published": "destructive",
  archived: "destructive"
};

export const PRODUCT_STATE_BADGE_VARIANT: Record<ProductState, BadgeVariant> = {
  created: "secondary",
  updated: "secondary",
  submitted: "default",
  resubmitted: "default",
  approved: "success",
  rejected: "destructive",
  applied: "default",
  published: "success",
  "withdrawn-applied": "destructive",
  "withdrawn-published": "destructive",
  archived: "destructive"
};

export const STATE_DISPLAY_TEXT: Record<ProductState, string> = {
  created: "Created",
  updated: "Updated",
  submitted: "Submitted",
  resubmitted: "Resubmitted",
  approved: "Approved",
  rejected: "Rejected",
  applied: "Applied", // Applied to be published
  published: "Published",
  "withdrawn-applied": "Withdrawn from applied",
  "withdrawn-published": "Withdrawn from published",
  archived: "Archived"
};
