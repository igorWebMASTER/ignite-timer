import { createContext, useContext, useEffect, useState } from 'react'
import {
    HomeContainer,
    StartCountDownButton,
    StopCountDownButton,
} from './styles'
import { HandPalm, Play } from 'phosphor-react'
import * as zod from 'zod'
import { NewCyclesForm } from './components/NewCycleForm'
import { CountDown } from './components/Countdown'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(1, 'O número de minutos deve ser no mínimo 5 minutos')
        .max(60, 'O número de minutos deve ser no máximo 60'),
})

export type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const { createNewCycle, activeCycle, interruptCurrentCycle } = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    const task = watch('task')
    const isSubmitDisable = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)}>

                <FormProvider {...newCycleForm}>
                    <NewCyclesForm />
                </FormProvider>
                <CountDown />

                {activeCycle
                    ? <StopCountDownButton type="submit" onClick={interruptCurrentCycle}>
                        <HandPalm size={24} />
                        Interromper
                    </StopCountDownButton>
                    :
                    <StartCountDownButton
                        disabled={isSubmitDisable}
                        type="submit"
                    >
                        <Play size={24} />
                        Começar
                    </StartCountDownButton>
                }
            </form>
        </HomeContainer >
    )
}