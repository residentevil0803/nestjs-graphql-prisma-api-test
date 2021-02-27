import { Field, InputType } from '@nestjs/graphql';

import { DateTimeFieldUpdateOperationsInput } from '../prisma/date-time-field-update-operations.input';
import { NullableStringFieldUpdateOperationsInput } from '../prisma/nullable-string-field-update-operations.input';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';

@InputType()
export class CommentUncheckedUpdateManyInput {
    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    id?: StringFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {
        nullable: true,
    })
    createdAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => DateTimeFieldUpdateOperationsInput, {
        nullable: true,
    })
    updatedAt?: DateTimeFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    body?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    authorId?: StringFieldUpdateOperationsInput;

    @Field(() => NullableStringFieldUpdateOperationsInput, {
        nullable: true,
    })
    articleId?: NullableStringFieldUpdateOperationsInput;
}
