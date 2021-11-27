export interface ModelCFramer {
  set: (desired_cframe: CFrame) => void;
  delete: () => void;
}

/**
 * Port for Sleitnick's `ModelCFramer` but modified
 *
 * SetPrimaryPartCFrame but avoids float errors via caching
 * @param model A model that has `PrimaryPart` property
 */
export function modelCFramer(model: Model): ModelCFramer {
  const primary = model.PrimaryPart!;
  const primary_cframe = primary.CFrame;
  const cache = new Map<BasePart, CFrame>();
  for (const child of model.GetDescendants()) {
    if (child.IsA("BasePart") && child !== primary) {
      cache.set(child, primary_cframe.ToObjectSpace(child.CFrame));
    }
  }
  return {
    set: (desired_cframe: CFrame) => {
      primary.CFrame = desired_cframe;
      cache.forEach((offset, part) => (part.CFrame = desired_cframe.mul(offset)));
    },
    delete: () => {
      // clear everything
      cache.clear();
    },
  };
}
