import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { PERSONALITY_TRAITS, MBTITestInfo, PersonalityTrait } from './MBTIProperties';
import { shuffleArray } from '@/util/TestUtils';
import TextEdgy from '@/components/TextEdgy';

interface Props {
    handleContinueButton: (testInfo: MBTITestInfo) => void;
    testInfo: MBTITestInfo;
    testReceiver: string;
}

const MBTIFunctionComponent: React.FC<Props> = ({ handleContinueButton, testInfo, testReceiver }) => {
    const [traits, setTraits] = useState<PersonalityTrait[]>(
        shuffleArray([...PERSONALITY_TRAITS]) as PersonalityTrait[]
    );

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        
        const newTraits = Array.from(traits);
        const [removed] = newTraits.splice(result.source.index, 1);
        newTraits.splice(result.destination.index, 0, removed);
        setTraits(newTraits);
    };

    const handleContinue = () => {
        testInfo.traits = traits.map(trait => trait.code);
        handleContinueButton(testInfo);
    };

    return (
        <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-8">
                <TextEdgy className="text-white text-lg mb-2">
                    Their top 3 traits:
                </TextEdgy>
                <TextEdgy className="text-accent text-sm">
                    Drag and drop to rank {testReceiver}{"'"}s top 3 traits (most relevant at top)
                </TextEdgy>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="traits-droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`mx-auto min-h-[300px] max-w-lg w-full rounded-xl p-4 border-2 ${
                                snapshot.isDraggingOver 
                                    ? 'border-accent bg-secondary/30' 
                                    : 'border-secondary bg-primary'
                            }`}
                        >
                            {traits.map((trait, index) => (
                                <Draggable key={trait.code} draggableId={trait.code} index={index}>
                                    {(provided, snapshot) => (
                                        <>
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`mb-3 p-4 rounded-lg border-2 shadow cursor-grab ${
                                                    snapshot.isDragging 
                                                        ? 'bg-accent/30 border-accent text-primary' 
                                                        : index < 3 
                                                            ? 'bg-accent/80 border-accent text-primary font-bold' 
                                                            : 'bg-accent/20 border-accent text-primary border-dashed'
                                                }`}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    userSelect: 'none'
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <span className={` mr-3 text-xl font-bold ${
                                                            index < 3 ? 'text-primary' : 'text-accent'
                                                        }`}>
                                                            ☰
                                                        </span>
                                                        <div>
                                                            <div className={`font-edgy text-lg ${
                                                                index < 3 ? 'text-primary' : 'text-primary/80'
                                                            }`}>
                                                                {trait.name}
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {index === 2 && (
                                                <div className="border-t-2 border-dashed border-accent/50 my-3"></div>
                                            )}
                                        </>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="text-center mt-8">
                <button 
                    onClick={handleContinue}
                    className="btn btn-secondary px-8 mb-8"
                >
                    <TextEdgy className="text-white">Continue to Part 3</TextEdgy>
                </button>
            </div>
        </div>
    );
};

export default MBTIFunctionComponent; 
