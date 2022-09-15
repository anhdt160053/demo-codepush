import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Loft3DiModel } from "../loft3Di/loft3Di"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  loft3DiModel: types.optional(Loft3DiModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
