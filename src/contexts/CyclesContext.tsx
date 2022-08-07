import { differenceInSeconds } from 'date-fns'
import {
    createContext,
    ReactNode,
    useEffect,
    useReducer,
    useState,
} from 'react'
import { ActionTypes, Cycle, cyclesReducer } from "../reducers/cycles";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondPast: number;
    setSecondsPassed: (secondsPassed: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext<CyclesContextType>({} as CyclesContextType)

interface CycleContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CycleContextProviderProps) {
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [cyclesState, dispatch] = useReducer(
        cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        () => {
            const storedStateAsJSON = localStorage.getItem(
                '@ignite-timer:cycles-state-1.0.0',
            )
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }

            return {
                cycles: [],
                activeCycleId: null,
            }
        })

    const { cycles } = cyclesState as any
    const activeCycle = cycles.find((cycle: { id: string | null; }) => cycle.id === activeCycleId)

    const [amountSecondPast, setAmountSecondPast] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }
        return 0
    })

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    function setSecondsPassed(seconds: number) {
        setAmountSecondPast(seconds)
    }

    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch({
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle
            }
        })
        setActiveCycleId(id)
        setAmountSecondPast(0)
    }

    function markCurrentCycleAsFinished() {
        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
            payload: {
                activeCycleId
            }
        })
        setActiveCycleId(null)
    }

    function interruptCurrentCycle() {
        dispatch({
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
            payload: {
                activeCycleId
            }
        })
        setActiveCycleId(null)
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondPast,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}