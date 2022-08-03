import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { differenceInSeconds } from 'date-fns'

import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountDownButton,
    StopCountDownButton,
    TaskInput,
} from './styles'
import { useEffect, useState } from 'react'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(5, 'O número de minutos deve ser no mínimo 5 minutos')
        .max(60, 'O número de minutos deve ser no máximo 60'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id?: string
    task: string
    minutesAmount: number
    isActive?: boolean
    startDate: Date
    interruptedDate?: Date
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondPast, setAmountSecondPast] = useState(0)

    const { register, handleSubmit, watch, reset, formState } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function handleInterruptCycle() {
        setCycles(
            cycles.map((cycle: Cycle) => {
                if (cycles.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                }
                return cycle
            })
        )
        setActiveCycleId(null)
    }

    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            interval = setInterval(() => {
                setAmountSecondPast(
                    differenceInSeconds(new Date(), activeCycle.startDate)
                )
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle])

    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondPast(0)
        reset()
    }

    const totalSecods = activeCycle ? activeCycle?.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSecods - amountSecondPast : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    const task = watch('task')
    const isSubmitDisable = !task

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        disabled={!!activeCycle}
                        placeholder="Dê um nome para o seu projeto"
                        {...register('task')}
                    />
                    <datalist id="task-suggestions">
                        <option value="Desenvolvimento de aplicações web" />
                        <option value="Desenvolvimento de aplicações mobile" />
                        <option value="Desenvolvimento de aplicações desktop" />
                        <option value="Banana" />
                    </datalist>
                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />
                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {activeCycle ?
                    <>
                        <StopCountDownButton type="submit" onClick={handleInterruptCycle}>
                            <HandPalm size={24} />
                            Interromper
                        </StopCountDownButton>
                    </> : <>
                        <StartCountDownButton disabled={isSubmitDisable} type="submit">
                            <Play size={24} />
                            Começar
                        </StartCountDownButton></>}
            </form>
        </HomeContainer>
    )
}