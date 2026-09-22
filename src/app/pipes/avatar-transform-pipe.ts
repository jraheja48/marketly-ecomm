import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarTransform',
})
export class AvatarTransformPipe implements PipeTransform {
  transform(value: string | undefined): string {
    console.log('Transforming value:', value);
    if (!value) return '';
    const avatarName = value
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase())
      .join('');
    console.log('Avatar name generated:', avatarName);
    return avatarName;
  }
}
