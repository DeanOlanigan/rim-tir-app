export const createAssetsSlice = (api) => ({
    assets: {}, // Record<assetId, AssetMeta>
    assetHashIndex: {}, // Record<assetHash, assetId>

    upsertAssetMeta(meta) {
        api.set((state) => ({
            assets: {
                ...state.assets,
                [meta.id]: meta,
            },
            assetHashIndex: meta.hash
                ? {
                      ...state.assetHashIndex,
                      [meta.hash]: meta.id,
                  }
                : state.assetHashIndex,
        }));
    },

    touchAssetLastUsed(assetId, ts = Date.now()) {
        api.set((state) => {
            const cur = state.assets?.[assetId];
            if (!cur) return state;

            return {
                assets: {
                    ...state.assets,
                    [assetId]: {
                        ...cur,
                        lastUsedAt: ts,
                    },
                },
            };
        });
    },
});
