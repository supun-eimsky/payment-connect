import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from '@/components/ui/card';
import { AvailableCategory } from '@/types/route';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge'
export function CategoryList({ onSelectCategory,categories}:any) {
    const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});
    const availableCategory: AvailableCategory[] = categories;




    const handleSelect = (id: any , name:string): void => {
       onSelectCategory(id,name)
    }
    return (
        <div>
            <Card className='gap-4 h-[100%]' >
                <CardHeader className="">
                    <CardTitle className="text-lg">
                        Bus Catogory
                    </CardTitle>
                    <CardDescription>

                        Please select one of the following categories to display the fare table.

                    </CardDescription>
                </CardHeader>
                <CardContent  >

                    <div className="* grid grid-cols-2 gap-4 px-4 ">
                        {availableCategory.map((category, idex) => (

                            <Card
                                key={category.id}
                                className="p-6 border gap-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer "
                                onClick={() => handleSelect(category.id ,category.name)}
                            >
                                <div className='flex justify-center'>
                                    <img src="/icons/bus-icon.svg"></img>
                                </div>
                                <h3 className="text-lg font-semibold mb-1 flex justify-center">{category.name}</h3>
                                <p className="text-sm text-gray-500 font-semibold mb-1 flex justify-center">CATEGORY {idex + 1}</p>
                                <Button variant="default" className="flex items-center gap-2 
                                        text-white font-medium
                                        rounded-[14px]
                                        px-5 py-2
                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                        hover:opacity-90
                                        shadow-md">
                                    View Fare Table
                                </Button>
                            </Card>
                        ))}


                    </div>
                </CardContent >

            </Card>


        </div>
    )
}
