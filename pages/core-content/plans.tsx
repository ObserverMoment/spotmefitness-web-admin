import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { LoadingSpinner } from '../../components/loadingIndicators'
import { showToast } from '../../components/notifications'
import { SummaryCard } from '../../components/styled-components/cards'
import {
  FlexBox,
  MainText,
  Title,
} from '../../components/styled-components/styled'
import {
  useOfficialWorkoutProgramsQuery,
  WorkoutProgram,
} from '../../graphql/generated_types'

export default function WorkoutPlans() {
  const [{ isOpen, title }, setModalState] = useState({
    isOpen: false,
    title: 'Workout Plan',
  })

  const { loading, error, data } = useOfficialWorkoutProgramsQuery()

  const [activeWorkoutPlanData, setActiveWorkoutPlanData] = useState(null)

  function handleCardClick(data: WorkoutProgram) {
    setActiveWorkoutPlanData(data)
    setModalState({ isOpen: true, title: 'Workout Plan' })
  }

  function handleAddNewClick() {
    setActiveWorkoutPlanData(null)
    setModalState({ isOpen: true, title: 'Create Workout Plan' })
  }

  if (error) {
    showToast(`Error retrieving data`, 'Error', 5000)
    console.error(error)
    return null
  } else if (loading) {
    return <LoadingSpinner />
  } else {
    return (
      <FlexBox direction="row" justify="center" wrap="wrap">
        <Title colorType="grey">Official Plans</Title>
        {data.officialWorkoutPrograms.map((wp: WorkoutProgram) => (
          <WorkoutProgramSummaryCard
            workoutProgram={wp}
            handleCardClick={handleCardClick}
          />
        ))}
      </FlexBox>
    )
  }
}

interface WorkoutProgramSummaryCardProps {
  workoutProgram: WorkoutProgram
  handleCardClick: (workoutProgram: WorkoutProgram) => void
}

export const WorkoutProgramSummaryCard = ({
  workoutProgram,
  handleCardClick,
}: WorkoutProgramSummaryCardProps) => (
  <SummaryCard
    maxWidth="300px"
    margin="10px"
    onClick={() => handleCardClick(workoutProgram)}
  >
    <FlexBox>
      <Title>{workoutProgram.name}</Title>
      <MainText>{workoutProgram.description}</MainText>
      {workoutProgram.coverImageUri && (
        <FlexBox align="center">
          <img
            style={{ borderRadius: '20px' }}
            height="100px"
            src={`https://ucarecdn.com/${workoutProgram.coverImageUri}/`}
          />
        </FlexBox>
      )}
    </FlexBox>
  </SummaryCard>
)
