import { produce } from 'immer'

export interface Cycle {
    id: string
    task: string
    minutesAmount?: number
    isActive?: boolean
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesState {
    cycles: Cycle[]
    activeCycleId?: string | null;
}

export enum ActionTypes {
    ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
    INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
    MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED'
}

export function cyclesReducer(state: CyclesState, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            return produce(state, draft => {
                draft.cycles.push(action.payload.newCycle);
                draft.activeCycleId = action.payload.activeCycleId
            })
        case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
            const curentCycleIndex = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId
            })

            if (curentCycleIndex < 0) {
                return state
            }

            return produce(state, draft => {
                draft.activeCycleId = null
                draft.cycles[curentCycleIndex].interruptedDate = new Date()
            })
        }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
            const curentCycleIndex = state.cycles.findIndex(cycle => {
                return cycle.id === state.activeCycleId
            })

            if (curentCycleIndex < 0) {
                return state
            }

            return produce(state, draft => {
                draft.activeCycleId = null
                draft.cycles[curentCycleIndex].finishedDate = new Date()
            })
        }
        default:
            return state
    }
}