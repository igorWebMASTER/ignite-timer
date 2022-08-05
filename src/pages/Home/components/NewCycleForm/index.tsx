import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useFormContext } from 'react-hook-form'
import { useContext } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'


export function NewCyclesForm() {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return (
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
                min={1}
                max={60}
                {...register('minutesAmount', { valueAsNumber: true })}
            />
            <span>minutos.</span>
        </FormContainer>
    )
}
