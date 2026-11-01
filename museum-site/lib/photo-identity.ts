// Reviewed duplicate artwork. Legacy asset URLs stay available for saved links.
export const duplicatePhotoAliases:Readonly<Record<string,string>>={
 '/assets/founder-brand-megapolis.png':'/assets/founder-megapolis-2026-10-16.png',
 '/assets/founder-futuristic-museum.png':'/assets/founder-megapolis-2026-10-16.png',
 '/assets/founder-atrium-fashion.png':'/assets/founder-grand-museum-interior.png',
 '/assets/vip-grand-museum.png':'/assets/approved-mega-museum.png',
};
export function canonicalPhotoPath(image:string):string{return duplicatePhotoAliases[image]??image;}
export function uniquePhotographs<T extends {image:string}>(items:readonly T[]):T[]{
 const chosen=new Map<string,T>();
 for(const item of items){const image=canonicalPhotoPath(item.image),previous=chosen.get(image);if(!previous||previous.image!==image&&item.image===image)chosen.set(image,item);}
 return [...chosen].map(([image,item])=>item.image===image?item:{...item,image});
}
